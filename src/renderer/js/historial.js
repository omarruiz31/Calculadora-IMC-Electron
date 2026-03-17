document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('historial-body')
    const clearBtn = document.getElementById('clear-history-btn')
    
    const loadHistory = async () => {
        if (window.api && window.api.getHistory) {
            try {
                const records = await window.api.getHistory()
                
                tbody.innerHTML = ''

                if (records.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay registros aún</td></tr>'
                    return
                }

                records.forEach(record => {
                    const tr = document.createElement('tr')
                    
                    let color = ''
                    if (record.categoria === 'Bajo peso') color = '#f1c40f'
                    else if (record.categoria === 'Normal') color = '#2ecc71'
                    else if (record.categoria === 'Sobrepeso') color = '#e67e22'
                    else color = '#e74c3c'

                    tr.innerHTML = `
                        <td>${record.fecha}</td>
                        <td>${record.altura}</td>
                        <td>${record.peso}</td>
                        <td><strong>${record.imc.toFixed(2)}</strong></td>
                        <td style="color: ${color}; font-weight: bold;">${record.categoria}</td>
                    `
                    tbody.appendChild(tr)
                })
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error cargando historial</td></tr>'
            }
        }
    }

    await loadHistory()
    
    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de que deseas borrar todo el historial?')) {
                if (window.api && window.api.clearHistory) {
                    try {
                        await window.api.clearHistory()
                        await loadHistory()
                    } catch (error) {}
                }
            }
        })
    }
})
