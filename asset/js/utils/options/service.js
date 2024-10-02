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
      const notiEl = this.createDiv(type)
      const iconel = this.createI('fa-circle-info');
      const closeel = this.createI('fa-circle-xmark');
      notiEl.classList.add("notification");
      const notiCardEl = this.createDiv("n-content")
      const glowEl = this.createDiv("bar")
      const close = this.createDiv("close")
      const icon = this.createDiv("n-icon")
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
  
  // demo
  notis = new Notifications(document.querySelector(".notifications"))
  

  