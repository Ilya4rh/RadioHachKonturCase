import Phaser from "phaser";
import programmer from "../images/programmer.png";
import code_title from "../images/code_title.png";
import invaders_title from "../images/invaders_title.png";
import moon from "../images/moon.png";
import start_button from "../images/start_button.png";
import blue_bug_for_menu from "../images/blue_bug_for_menu.png";
import red_bug_for_menu from "../images/red_bug_for_menu.png";
import star from "../images/star.png";

interface Tournament {
    id: string;
    name: string;
}

export class MainMenuScene extends Phaser.Scene
{
    formElement: Phaser.GameObjects.DOMElement | null = null;

    constructor() {
        super({key: "MainMenuScene"});
    }

    preload ()
    {
        this.load.image('code_title', code_title);
        this.load.image('invaders_title', invaders_title);
        this.load.image('moon', moon);
        this.load.image('start_button', start_button);
        this.load.image('blue_bug_for_menu', blue_bug_for_menu);
        this.load.image('red_bug_for_menu', red_bug_for_menu);
        this.load.image('star', star);
    }

    create ()
    {
        if (this.formElement) {
            this.formElement.destroy();
            this.formElement = null;
        }
        this.children.removeAll();

        this.add.image(550, 300, "code_title");
        this.add.image(550, 500, "invaders_title");
        this.add.image(500, 1650, "moon").setScale(1.5);
        this.add.image(660, 900, "blue_bug_for_menu");
        this.add.image(160, 1000, "red_bug_for_menu");
        this.add.image(100, 600, 'star');
        this.add.image(50, 1200, 'star');
        this.add.image(1020, 200, 'star');
        this.add.image(900, 1000, 'star');

        const tournaments: Tournament[] | undefined = this.game.registry.get('tournaments');
        const tournamentsError: string | null | undefined = this.game.registry.get('tournamentsError');

        let formHtml = `
        <style>
            .phaser-login-form {
                display: flex;
                flex-direction: column;
                width: 450px;
                padding: 30px;
                background-color: rgba(0, 0, 30, 0.8);
                border-radius: 15px;
                border: 1px solid #6060ff;
                box-shadow: 0 0 15px rgba(100, 100, 255, 0.5);
                font-family: Arial, sans-serif;
            }
            .phaser-login-form label {
                color: #a0a0ff;
                margin-bottom: 8px;
                font-size: 16px;
            }
            .phaser-login-form select,
            .phaser-login-form input[type="text"],
            .phaser-login-form button {
                padding: 12px;
                margin-bottom: 20px;
                border-radius: 8px;
                border: 1px solid #404080;
                background-color: #101030;
                color: #ffffff;
                font-size: 18px;
            }
            .phaser-login-form select:focus,
            .phaser-login-form input[type="text"]:focus {
                outline: none;
                border-color: #8080ff;
                box-shadow: 0 0 5px rgba(130, 130, 255, 0.5);
            }
             .phaser-login-form option {
                 background-color: #101030;
                 color: #ffffff;
             }
            .phaser-login-form button {
                background-color: #4040ff;
                cursor: pointer;
                transition: background-color 0.3s;
                margin-top: 10px;
            }
            .phaser-login-form button:hover {
                background-color: #6060ff;
            }
            .phaser-login-form button:disabled {
                background-color: #202060;
                cursor: not-allowed;
            }
            .phaser-login-form .error-message {
                color: #ff6060;
                font-size: 14px;
                margin-top: -10px;
                 margin-bottom: 10px;
                 min-height: 1.2em; /* Резервируем место под ошибку */
            }
            .phaser-login-form .loading-message {
                 color: #aaaaff;
                 text-align: center;
                 padding: 20px;
             }
        </style>
        <div class="phaser-login-form">
    `;

        if (tournamentsError) {
            formHtml += `<div class="error-message">Ошибка загрузки турниров: ${tournamentsError}</div>`;
        } else if (!tournaments) {
            formHtml += `<div class="loading-message">Загрузка данных...</div>`;
        } else if (tournaments.length === 0) {
            formHtml += `<div class="error-message">Нет доступных турниров для участия.</div>`;
        } else {
            const preselectedTournamentId: string | null | undefined = this.game.registry.get('preselectedTournamentId');

            formHtml += `<label for="tournamentSelect">Выберите турнир:</label>`;
            formHtml += `<select id="tournamentSelect" name="tournamentId" required>`;
            formHtml += `<option value="" disabled ${!preselectedTournamentId ? 'selected' : ''}>-- Выберите --</option>`;
            tournaments.forEach(t => {
                 const selectedAttr = (t.id === preselectedTournamentId) ? 'selected' : '';
                 formHtml += `<option value="${t.id}" ${selectedAttr}>${t.name}</option>`;
            });
            formHtml += `</select>`;

            formHtml += `<label for="playerNameInput">Ваше имя:</label>`;
            formHtml += `<input type="text" id="playerNameInput" name="playerName" placeholder="Введите имя" required maxlength="50">`;

             formHtml += `<div id="validationError" class="error-message"></div>`;
            formHtml += `<button id="startButton">Начать игру</button>`;
        }

        formHtml += `</div>`;

        this.formElement = this.add.dom(540, 1150).createFromHTML(formHtml);
        this.formElement.setScale(1.5);

        const startButton = this.formElement.getChildByID('startButton');
        if (startButton) {
            startButton.addEventListener('click', (event) => {
                event.preventDefault();

                const tournamentSelect = this.formElement!.getChildByName('tournamentId') as HTMLSelectElement;
                const playerNameInput = this.formElement!.getChildByName('playerName') as HTMLInputElement;
                const validationErrorDiv = this.formElement!.getChildByID('validationError') as HTMLDivElement;

                const tournamentId = tournamentSelect?.value;
                const playerName = playerNameInput?.value.trim();
                 if (validationErrorDiv) validationErrorDiv.textContent = '';

                if (!tournamentId) {
                     if (validationErrorDiv) validationErrorDiv.textContent = 'Пожалуйста, выберите турнир.';
                    tournamentSelect?.focus();
                    return;
                }
                if (!playerName) {
                    if (validationErrorDiv) validationErrorDiv.textContent = 'Пожалуйста, введите имя.';
                    playerNameInput?.focus();
                    return;
                }

                console.log(`Starting game: Tournament=${tournamentId}, Player=${playerName}`);

                this.scene.start("GameScene", { tournamentId, playerName });
            });
        }
    }
}