async function adapt(network) {
    const sourceText = document.getElementById('sourceText').value;
    const contentBox = document.getElementById(`content-${network}`);

    if (!sourceText.trim()) {
        alert('Por favor, cole um texto base primeiro para a IA trabalhar.');
        return;
    }

    // Efeito visual de loading estilo IA gerando
    disableButtons(true);
    contentBox.innerHTML = '<span class="loading-pulse">Sintetizando copy Flash...</span>';

    try {
        const response = await fetch('/api/adapt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: sourceText, targetNetwork: network })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro desconhecido no servidor');
        }

        // Exibe o resultado com uma leve animação de fade
        contentBox.style.opacity = 0;
        contentBox.innerText = data.result;
        setTimeout(() => contentBox.style.opacity = 1, 50);

    } catch (error) {
        console.error('Erro:', error);
        contentBox.innerText = `Falha na matriz: ${error.message}`;
        contentBox.style.color = "#ef4444"; // Vermelho para erro
    } finally {
        disableButtons(false);
    }
}

function disableButtons(status) {
    document.getElementById('btn-instagram').disabled = status;
    document.getElementById('btn-x').disabled = status;
    document.getElementById('btn-linkedin').disabled = status;
}

// Funcionalidade essencial para copywriters: Copiar texto gerado
function copyText(elementId, btnElement) {
    const textToCopy = document.getElementById(elementId).innerText;
    
    if (textToCopy === "Aguardando comando..." || textToCopy.includes("Sintetizando")) {
        return; // Não copia placeholder ou loading
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = "Copiado! ✓";
        btnElement.style.background = "#22c55e"; // Fica verde
        btnElement.style.color = "#000";
        btnElement.style.borderColor = "#22c55e";
        
        // Volta ao normal após 2 segundos
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.background = "transparent";
            btnElement.style.color = "#a1a1aa";
            btnElement.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }, 2000);
    });
}