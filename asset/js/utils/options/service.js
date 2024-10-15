class Notifications {
  constructor(el) {
    this.el = el
  }
  
  // function to create new elements with a class (cleans up code)
  createDiv(className = "") {
    const el = document.createElement("div")
    el.classList.add(className)
    return el
  }
  createI(className = "") {
    const el = document.createElement("i")
    el.classList.add('fa-solid')
    el.classList.add(className)
    return el
  }
  createP(className = "") {
    const el = document.createElement("p")
    el.classList.add(className)
    return el
  }
  // function to add text nodes to elements
  addText(el, text) {
    el.appendChild(document.createTextNode(text))
  }
  
  create(
      type = "info",
    description = "...",
    duration = 5.8,
  ) {
    
     // functions
      function destroy(animate) {
          notiEl.remove()
      }
    
    
    // create the elements and add their content
    let iconel ;
    let glowEl ;
    let icon ;
    const notiEl = this.createDiv(type)
    switch (type) {
      case "info":
        iconel = this.createI('fa-circle-info');
        glowEl = this.createDiv("bar");
        icon = this.createDiv("n-icon");
        break;
      case "success":
        
        iconel = this.createI('fa-check');
        glowEl = this.createDiv("bar-success");
        icon = this.createDiv("n-icon-success");
        break;
      case "warning":
        iconel = this.createI('fa-circle-exclamation');
        glowEl = this.createDiv("bar-error");
        icon = this.createDiv("n-icon-error");
        break;
      case "error":
        iconel = this.createI('fa-circle-xmark');
        glowEl = this.createDiv("bar-error");
        icon = this.createDiv("n-icon-error");
        break;
      default:
        console.warn("Type inconnu :", type);
        iconel = this.createI('fa-question-circle'); // Icône par défaut
        glowEl = this.createDiv("bar");
        icon = this.createDiv("n-icon");
        break;
    }
    
    const closeel = this.createI('fa-circle-xmark');
    notiEl.classList.add("notification");
    const notiCardEl = this.createDiv("n-content")
    
    const close = this.createDiv("close")
    const borderEl = this.createDiv("notiborderglow")
    
    
    const descriptionEl = this.createP("notidesc")
    this.addText(descriptionEl, description)
    
    // append the elements to each other
    notiEl.appendChild(notiCardEl)
    notiEl.appendChild(close)
    notiCardEl.appendChild(glowEl)
    notiCardEl.appendChild(icon)
    icon.appendChild(iconel)
    close.appendChild(closeel)
    notiCardEl.appendChild(descriptionEl)
    
    this.el.appendChild(notiEl)

     // detruire l'objet quand on clique sur .close
      notiEl.addEventListener("click", () => destroy(true))

    
    
    // remove the notification after the set time if there is one
    if (duration != 0) {
      setTimeout(() => {
        notiEl.classList.add("outi")
        notiEl.addEventListener("animationend", () => {notiEl.remove()})
      }, duration * 1000)
    }
    return notiEl
  }
}
class LayerView {
constructor(el) {
  this.el = el
}

// function to create new elements with a class (cleans up code)
createDiv(className = "") {
  const el = document.createElement("div")
  el.classList.add(className)
  return el
}
createI(className = "") {
  const el = document.createElement("i")
  el.classList.add('fa-solid')
  el.classList.add(className)
  return el
}
createSpan(className = "") {
  const el = document.createElement("span")
  el.classList.add(className)
  return el
}
// function to add text nodes to elements
addText(el, text) {
  el.appendChild(document.createTextNode(text))
}

create(
  rang = 1,
  icon = "fa-child-reaching",
  name = ""
) {
  
    // functions
    function destroy(animate) {
        notiEl.remove()
    }
  
  
  // create the elements and add their content
  const layerDiv = this.createDiv("list-item")
  const itemDiv = this.createDiv("item-content")
  const itemicon = this.createDiv("li-icon")
  const itemspan = this.createSpan("order")
  const itemname = this.createDiv("li-name")
  const itemi = this.createI("fa-child-reaching")

  this.addText(itemname, name)
  this.addText(itemspan, rang)

  itemicon.appendChild(itemi)
  itemDiv.appendChild(itemicon)
  itemDiv.appendChild(itemspan)
  itemDiv.appendChild(itemname)
  layerDiv.appendChild(itemDiv)
  
  
  this.el.appendChild(layerDiv)
  
  return layerDiv
}
}
// demo
notis = new Notifications(document.querySelector(".notifications"))
layerView = new LayerView(document.querySelector(".container"))


