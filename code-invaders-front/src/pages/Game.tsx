import Phaser from "phaser";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { config } from "../PhaserConfig";
import { GameScene } from "../scenes/GameScene";
import { MainMenuScene } from "../scenes/MainMenuScene";

interface Tournament {
    id: string;
    name: string;
}

export function Game() {
    const location = useLocation();
    const gameInstanceRef = useRef<Phaser.Game | null>(null);

    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const phaserContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTournaments = async () => {
            setIsLoadingTournaments(true);
            setError(null);
            try {
                const response = await fetch('http://51.250.71.162:5085/api/tournaments', {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTournaments(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Не удалось загрузить турниры.');
            } finally {
                setIsLoadingTournaments(false);
            }
        };

        fetchTournaments();
    }, []);

    useEffect(() => {
        if (isLoadingTournaments || !phaserContainerRef.current || gameInstanceRef.current) return;

        const queryParams = new URLSearchParams(location.search);
        const preselectedTournamentId = queryParams.get('tid');

        const newConfig = {
            ...config,
            parent: phaserContainerRef.current,
            scene: [MainMenuScene, GameScene]
        };

        const game = new Phaser.Game(newConfig);
        gameInstanceRef.current = game;

        game.registry.set('tournaments', tournaments);
        game.registry.set('tournamentsError', error);
        if (preselectedTournamentId) {
            game.registry.set('preselectedTournamentId', preselectedTournamentId);
        }

        return () => {
            const gameToDestroy = gameInstanceRef.current;
            if (gameToDestroy) {
                 gameToDestroy.destroy(true);
                 gameInstanceRef.current = null;
            }
        };
    }, [isLoadingTournaments, tournaments, error, location.search]);

    return (
        <div style={{ backgroundColor: '#09022E', position: 'absolute', bottom: '0', width: '100%', height: '100%' }}>
            <div ref={phaserContainerRef} id="phaser-container" style={{ width: '100%', height: '100%' }} />

             {isLoadingTournaments && <p style={{position: 'absolute', top: '10px', left: '10px', color: 'white'}}>Загрузка турниров...</p>}
             {!isLoadingTournaments && error && <p style={{position: 'absolute', top: '10px', left: '10px', color: 'red'}}>Ошибка загрузки: {error}</p>}
        </div>
    );
}