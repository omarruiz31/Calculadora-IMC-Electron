document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.box')
    const alturaInput = document.getElementById('altura')
    const pesoInput = document.getElementById('peso')
    
    let resultDiv = document.getElementById('resultado')
    if (!resultDiv) {
        resultDiv = document.createElement('div')
        resultDiv.id = 'resultado'
        resultDiv.className = 'resultado'
        form.appendChild(resultDiv)
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const alturaCm = parseFloat(alturaInput.value)
        const pesoKg = parseFloat(pesoInput.value)

        if (!alturaCm || !pesoKg || alturaCm <= 0 || pesoKg <= 0) {
            resultDiv.innerHTML = 'Por favor, ingrese valores válidos.'
            resultDiv.style.backgroundColor = '#ff4a4a'
            resultDiv.style.display = 'block'
            return
        }

        const alturaM = alturaCm / 100
        const imc = (pesoKg / (alturaM * alturaM)).toFixed(2)
        
        let categoria = ''
        let color = ''

        if (imc < 18.5) {
            categoria = 'Bajo peso'
            color = '#f1c40f'
        } else if (imc >= 18.5 && imc < 24.9) {
            categoria = 'Normal'
            color = '#2ecc71'
        } else if (imc >= 25 && imc < 29.9) {
            categoria = 'Sobrepeso'
            color = '#e67e22'
        } else {
            categoria = 'Obesidad'
            color = '#e74c3c'
        }

        resultDiv.innerHTML = `<strong>Tu IMC:</strong> ${imc} <br> <strong>Categoría:</strong> ${categoria}`
        resultDiv.style.backgroundColor = color
        resultDiv.style.color = '#fff'
        resultDiv.style.display = 'block'

        if (window.api && window.api.saveImc) {
            try {
                await window.api.saveImc({
                    fecha: new Date().toLocaleString(),
                    altura: alturaCm,
                    peso: pesoKg,
                    imc: parseFloat(imc),
                    categoria: categoria
                })
            } catch (error) {
                console.error(error)
            }
        }
    })
})
