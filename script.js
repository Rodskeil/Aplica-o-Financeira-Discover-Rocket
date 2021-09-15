//criamos um objeto dento da const Modal(o objeto fica dentro de {})
const Modal = {
    open() {
            //Abrir o Modal
            //Adiciona a class active no modal
           document
                            .querySelector('.modal-overlay')
                            .classList.add('active')
    },
    close(){
            //Fechar o Modal
            //Remove a class active do modal
            document
                            .querySelector('.modal-overlay')
                            .classList.remove('active')
    }
}

const Storage={
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
    },
    set(transaction){
        localStorage.setItem("dev.finances:transaction", JSON.stringify(transaction))
    }
}


const Transaction = {
    all: Storage.get(),
    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
            Transaction.all.splice(index, 1)

            App.reload()
    },

    incomes() {
        let income = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amaunt > 0  ){
                income += transaction.amaunt;
            }
        })

        return income;
    },
    expenses() {
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amaunt < 0  ){
                expense += transaction.amaunt;
            }
        })

        return expense;
    },
    total() {
         return Transaction.incomes() + Transaction.expenses();
    }
} //responsavél apenas pelo calculo matematico.

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
            const tr = document.createElement ('tr')
            tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
            tr.dataset.index = index

            DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
            const CSSclass = transaction.amaunt > 0 ? "income" :
            "expense"

            const amount = Utils.formatCurrency(transaction.amaunt)

            const html = `
            
                        <td class="description">${transaction.description}</td>
                        <td class="${CSSclass}">${amount}</td>
                        <td class="date">${transaction.date}</td>
                        <td>
                            <img onclick="Transaction.remove(${index})" src="/Assets/minus.svg" alt="remover transação">
                        </td>
                     ` //só podemos utilizar esse tipo de aspas para poder colocar o que copiamos do HTML, no restante iria dar erro.

                  return html   
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
        formatAmaunt(value){
            value = Number(value) * 100

            return value 
        },
        formatDate (date) {
            const splittedDate = date.split("-")
            return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        },
        formatCurrency(value){
            const signal = Number(value) < 0 ? "-" : ""

            value = String(value).replace(/\D/g, "")

            value = Number(value) / 100

            value = value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })

            return signal + value
        }
}

const Form = {
        description: document.querySelector('input#description'),
        amaunt: document.querySelector('input#amaunt'),
        date: document.querySelector('input#date'),

        getValues() {
            return {
                description: Form.description.value,
                amaunt: Form.amaunt.value,
                date: Form.date.value,
            }
        },
        validateFields() {
            const { description, amaunt, date} = Form.getValues()

            if(description.trim() === "" || 
                amaunt.trim() === "" || 
                date.trim() === "") {
                    throw new Error("Por Favor, Preencha Todos Os Campos")
            }
        },

        formatValues() {
            let { description, amaunt, date } = Form.getValues()

            amaunt = Utils.formatAmaunt(amaunt)

            date = Utils.formatDate(date)

            return {
                description,
                amaunt,
                date,
            }
        },

        clearFields() {
            Form.description.value = ""
            Form.amaunt.value = ""
            Form.date.value = ""
        },

        submit(event){
            event.preventDefault()

            try {
                // verificar se todas as informaçoes foram preenchidas:
                Form.validateFields()
                // pegar e formartar os dados para salvar
                const transaction = Form.formatValues()
                // salvar
                Transaction.add(transaction)
                // apagar os dados do formulario
                Form.clearFields()
                // modal feche
                Modal.close()
                // Atualizar  a aplicação, já temos um desse funcionando lá acima.
            } catch (error) {
                alert(error.message)
            }
            
        },
}


const App = {
    init() { 
        Transaction.all.forEach((transaction, index) =>{
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()
        
        Storage.set(Transaction.all)
    },
    reload() {
            DOM.clearTransactions()
            App.init()
    },
}

App.init()


