// localstorage mai jab save aur update karna hota jab hum orignal tasks ko modify karte hai
//  Data change → localStorage update
// Sirf view change → no localStorage

// HTML refresh ho jata hai → JS se dubara append karna padta hai”
//  Page load / refresh pe kya hota hai?
// HTML fresh load hota hai
// 👉 (jaise blank template)
// LocalStorage se data aata hai
// 👉 (tumhara saved tasks)
// JS run hota hai
// 👉 (showTask)
// JS DOM banata hai
// 👉 (li, span, buttons, etc.)

let input = document.querySelector('#taskInput')
let addBtn = document.querySelector('#addBtn')
let ul = document.querySelector('#taskList')
let category = document.querySelector('#category')

let tasks = JSON.parse(localStorage.getItem("tasks")) || []
console.log(tasks);

// ui render function

// we used global tasks as a parameter in functon the we put data of tasks array


// list decide karta hai kya dhikyayega 
//  tasks deafault value hai 
function showTask(list = tasks){
    ul.innerHTML =""
    

    // empty state
    
       if (tasks.length === 0) {
    ul.innerHTML = "<p>No tasks yet 😴</p>"
    return
}

if (list.length === 0) {
    ul.innerHTML = "<p>No matching tasks found 🔍</p>"
    return
}
    
  
    list.forEach(function(item, index){

    let li = document.createElement('li')
    li.classList.add("task")

    let text = document.createElement('span')
    text.textContent = item.text // keyname ke through access

    let complete = document.createElement('button')
    let remove = document.createElement('button')
    let edit = document.createElement('button')


let searchValue = input.value.trim()

if(searchValue){
    let regex = new RegExp(searchValue, "gi")
    let highlight = item.text.replace(regex, `<mark>$&</mark>`)
    text.innerHTML = highlight
}else{
      text.textContent = item.text 
}


    // complete event
complete.classList.add("completed")
if(item.completed){
    text.classList.add("done")
    complete.textContent ="✔"
    complete.style.backgroundColor ="green"
    complete.style.color = "white"
    complete.style.border ="none"
}

    complete.addEventListener('click', function(){
        item.completed = !item.completed
        localStorage.setItem("tasks", JSON.stringify(tasks))
        showTask(checkFilter())
    })

    // remove event
    remove.classList.add("delete")
    remove.textContent ="🗑️"
    remove.addEventListener('click', function(){
     

        tasks = tasks.filter(i => i.id !== item.id)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        showTask(checkFilter())
    })

    // edit event
    edit.classList.add("edit")
    edit.textContent = "✎"
    edit.addEventListener('click', function(){
        let newValue = prompt("Edit Task", item.text)
        if(newValue){
            item.text = newValue
            localStorage.setItem("tasks", JSON.stringify(tasks))
            showTask(checkFilter())
        }

        let newCat = prompt("Edit task", item.category)
        if (newCat) {
            item.category = newCat.toLowerCase().trim()
              localStorage.setItem("tasks", JSON.stringify(tasks))
            showTask(checkFilter())
        }
    })


// pin
let pin = document.createElement('button')
pin.textContent ="📌"
pin.classList.add('pin')

pin.addEventListener('click',function(){
item.pinned = !item.pinned

tasks.sort((a,b) => b.pinned - a.pinned) // sort arrangs the aaray in ascending

localStorage.setItem("tasks", JSON.stringify(tasks))

showTask(checkFilter())
})


// category 
let content = document.createElement('div')
content.classList.add("content")

let cat = document.createElement('span')
 cat.textContent = item.category
 cat.classList.add("cat")
 
    // divs
    let leftDiv = document.createElement('div')
    leftDiv.classList.add("left")
    let rightDiv = document.createElement('div')
rightDiv.classList.add("right")

    leftDiv.appendChild(complete)
    content.appendChild(text)
    content.appendChild(cat)
    rightDiv.appendChild(remove)
    rightDiv.appendChild(edit)
    rightDiv.appendChild(pin)

    
    li.appendChild(leftDiv)
    li.appendChild(content)
    li.appendChild(rightDiv)

    ul.appendChild(li)

})

counterCheck()

}


// 👉 Ek variable banaya (currentFilter)
// 👉 Buttons banaye
// 👉 Button click pe currentFilter change kiya
// 👉 showTask me checkFilter chalaya
// 👉 checkFilter ne condition ke according data diya
// 👉 showTask ne UI update kiya

// checkFilter 

let currentFilter = 'allBtn'

function checkFilter(){
    if(currentFilter === 'pendingBtn'){
// return tasks.filter((i) => !i.completed)    
return tasks.filter(i => i.completed === false)
    }
    else if(currentFilter === 'completedBtn'){
        // return tasks.filter( (i) => i.completed)
        return tasks.filter(i => i.completed === true)
    }else{
       return tasks
    }
}





// filter system 

function filterSystem(){
    let pendingBtn = document.createElement('button')
    let allBtn = document.createElement('button')
    let completedBtn = document.createElement('button')

    pendingBtn.classList.add("pendingBtn")
    allBtn.classList.add("allBtn")
    completedBtn.classList.add("completedBtn")
    

    pendingBtn.textContent = "Pending"
    allBtn.textContent = "All"
    completedBtn.textContent = "Completed"

    
    pendingBtn.addEventListener('click', function(){
        currentFilter ='pendingBtn'
        
  pendingBtn.classList.add('activeFilter')
  allBtn.classList.remove('activeFilter')
  completedBtn.classList.remove('activeFilter')

        showTask(checkFilter()) // ui // current filter ke according data dikhaye"
})
    

allBtn.addEventListener('click', function(){
    currentFilter = 'allBtn'

allBtn.classList.add("activeFilter")
pendingBtn.classList.remove("activeFilter")
completedBtn.classList.remove("activeFilter")

    showTask(checkFilter())
})


completedBtn.addEventListener('click', function(){
    currentFilter = 'completedBtn'

    completedBtn.classList.add("activeFilter")
    pendingBtn.classList.remove("activeFilter")
    allBtn.classList.remove("activeFilter")


    showTask(checkFilter())
})

 let header = document.querySelector('header')
 header.appendChild(pendingBtn)
 header.appendChild(allBtn)
 header.appendChild(completedBtn)


}

filterSystem()




 // clear
let clearBtn = document.querySelector('.clearBtn')

    clearBtn.addEventListener('click', function(){
tasks = tasks.filter((i) =>{ return i.completed === false})

localStorage.setItem("tasks",JSON.stringify(tasks))
showTask(checkFilter())
    })
    

// counter check

let check = document.querySelector('#counter')

function counterCheck(){
let pending = tasks.filter(i => i.completed === false)
let completed = tasks.filter(i => i.completed === true)

check.textContent = `left ${pending.length} | done ${completed.length}`

}

// ✔ checkFilter() inside search = correct
// ✔ Order important hai:



// search filter 

// checkFilter()  → array deta hai
//         ↓
// filtered = array
//         ↓
// filtered.filter(...) → new array
//         ↓
// showTask()

function search (){
let filtered = checkFilter() 

let searchValue = input.value.toLowerCase() // value from user
if (searchValue) {
   return filtered.filter(i => i.text.toLowerCase().includes(searchValue))
}
return filtered

}

input.addEventListener('input', function(){
showTask(search()) // ui
})



// addTask data function

function addTask(){
  let value =  input.value.toLowerCase().trim()
//   regex =>  !/^[a-zA-Z\s]+$/2.test(value)

  if(value.trim() === "") return alert('please enter a valid task')

    let categoryValue = category.value

    if(categoryValue === ""){ return alert("please give category")}
    

  let duplicate = tasks.some( (i)=> { return i.text.toLowerCase() === value.toLowerCase()})
  if(duplicate){
    alert("task already existing")
    input.value =""
    return
  }


tasks.push({
    text:value,
    id: Date.now(), // li has uniqic id
    completed: false,
    pinned: false,
    category: categoryValue.toLowerCase().trim()
})

localStorage.setItem("tasks",JSON.stringify(tasks))

input.value =""
category.value =""
showTask()


}




//  Event
input.addEventListener('keydown',function(e){

    if(e.key === 'Enter'){
        addTask()
    }
})


addBtn.addEventListener('click', function(){
    addTask()
})

// load

showTask()




