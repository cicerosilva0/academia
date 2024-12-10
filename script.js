document.addEventListener('DOMContentLoaded', () => {
    const treinos = {
        treinoA: [
            { exercicio: 'Supino Reto (B)', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Supino Inclinado (H)', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Voador', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Desenvolvimento (H)', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Elevação Lateral (H)', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Tríceps Corda', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Tríceps Francês (H)', series: 4, repeticoes: '12 a 15', peso: '', feito: false, intervalo: "1'" },
        ],
        treinoB: [
            { exercicio: 'Leg Press 45', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Hack Machine', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Extensor', series: 3, repeticoes: '12 a 15', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Afundo (H)', series: 3, repeticoes: '12 a 15', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Flexora Sentada', series: 4, repeticoes: '20', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Panturrilha Sentada', series: 4, repeticoes: '20', peso: '', feito: false, intervalo: "1'" },
        ],
        treinoC: [
            { exercicio: 'Remada Baixa Art. (N)', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Puxador Vertical Art. (Pro)', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Puxador Alto (N)', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Remada Baixa (Pro)', series: 3, repeticoes: '15-12-10', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Rosca Martelo (H)', series: 3, repeticoes: '12 a 15', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'Rosca Direta (B)', series: 4, repeticoes: '20', peso: '', feito: false, intervalo: "1'" },
            { exercicio: 'ABS Supra Corda', series: 4, repeticoes: '20-18-15-12', peso: '', feito: false, intervalo: "1'" },
        ]
    };

    const renderTable = (data, tableBodyId, progressId) => {
        const tableBody = document.getElementById(tableBodyId);
        const progress = document.getElementById(progressId);
        tableBody.innerHTML = '';

        let feitoCount = 0;

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.exercicio}</td>
                <td>${item.series}</td>
                <td>${item.repeticoes}</td>
                <td><input type="number" class="peso-input" value="${item.peso}" onchange="updatePeso(${index}, '${tableBodyId}')"></td>
                <td>
                    <button class="feito-button ${item.feito ? 'concluido' : 'marcar'}" 
                        onclick="toggleFeito(${index}, '${tableBodyId}', '${progressId}')">
                        ${item.feito ? '✔️ Feito' : 'Marcar'}
                    </button>
                </td>
                <td>${item.intervalo}</td>
            `;
            tableBody.appendChild(row);

            if (item.feito) feitoCount++;
        });

        const progressPercentage = (feitoCount / data.length) * 100;
        progress.value = progressPercentage;
    };

    window.toggleFeito = (index, tableBodyId, progressId) => {
        const treinoKey = tableBodyId.split('-')[0];
        const treino = treinos[treinoKey];
        treino[index].feito = !treino[index].feito;
        renderTable(treino, tableBodyId, progressId);
    };

    window.updatePeso = (index, tableBodyId) => {
        const treinoKey = tableBodyId.split('-')[0];
        const treino = treinos[treinoKey];
        treino[index].peso = document.querySelector(`#${tableBodyId} tr:nth-child(${index + 1}) .peso-input`).value;
    };

    window.exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        Object.entries(treinos).forEach(([treinoKey, treinoData]) => {
            const sheetData = treinoData.map(exercicio => [
                exercicio.exercicio,
                exercicio.series,
                exercicio.repeticoes,
                exercicio.peso || '',
                exercicio.feito ? 'Sim' : 'Não',
                exercicio.intervalo
            ]);

            sheetData.unshift(['Exercício', 'Séries', 'Repetições', 'Peso', 'Feito', 'Intervalo']);
            const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, treinoKey);
        });

        XLSX.writeFile(workbook, 'treino.xlsx');
    };

    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            const treinoId = button.getAttribute('data-treino');
            document.querySelectorAll('.treino-section').forEach(section => section.classList.remove('active'));
            document.getElementById(treinoId).classList.add('active');
            renderTable(treinos[treinoId], `${treinoId}-body`, `progress${treinoId.charAt(treinoId.length - 1).toUpperCase()}`);
        });
    });

    document.querySelector('[data-treino="treinoA"]').click();

    // Cronômetro
    let timers = {}; // Para evitar múltiplos timers

    function startTimer(timerId) {
        if (timers[timerId]) return; // Evita múltiplos timers

        const timerElement = document.getElementById(timerId);
        let totalTime = 60;

        timers[timerId] = setInterval(() => {
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            totalTime--;

            if (totalTime < 0) {
                clearInterval(timers[timerId]);
                delete timers[timerId];
                alert(`Cronômetro ${timerId} finalizado!`);
            }
        }, 1000);
    }

    window.startTimer = startTimer;
});
