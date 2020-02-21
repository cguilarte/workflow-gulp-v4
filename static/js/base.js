// missing forEach on NodeList for IE11
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

/* Fix Array Internet Explorer */
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
    for(var i=0; i<this.length; i++){
      if(this[i]==obj){
        return i;
      }
    }
    return -1;
  }
}
/** 
  Agragar Clase a una etiqueta
  @param: nombre de la classe a agregar.
**/
Node.prototype.addClass = function(className) {
  this.classList.add(className);
};
/** 
  Elimina un Clase a una etiqueta
  @param: nombre de la classe a agregar.
**/
Node.prototype.removeClass = function(className) {
  this.classList.remove(className);
};
/** 
  Agraga o elimina una clase a una etiqueta
  @param: nombre de la classe .
**/
Node.prototype.toggleClass = function(className) {
  this.classList.contains(className)
    ? this.classList.remove(className)
    : this.classList.add(className);
};
/** 
  Remplazar una clase
  @param reg: busca
  @parame valor: remplaza
**/
Node.prototype.removeClassByPrefix = function(reg, valor) {
    const regx = new RegExp("\\b"+ reg +"[^ ]*[ ]?\\b", "g");
    this.className = this.className.replace(
      regx,
      reg + valor
    );
}
/** 
  Esta funcion habilita los mensajes de errores de html5 validation
**/
if (!HTMLFormElement.prototype.reportValidity) {
  HTMLFormElement.prototype.reportValidity = function() {
      if (this.checkValidity()) return true;
      var btn = document.createElement('button');
      this.appendChild(btn);
      btn.click();
      this.removeChild(btn);
      return false;
  };
}

if (!HTMLInputElement.prototype.reportValidity) {
  HTMLInputElement.prototype.reportValidity = function(){
      if (this.checkValidity()) return true
      var form = this.form;
      var tmpForm;
      if (!form) {
          tmpForm = document.createElement('form');
          tmpForm.style.display = 'inline';
          this.before(tmpForm);
          tmpForm.append(this);
      }

      
      var siblings = Array.from(form.elements).filter(function(input){
          return input !== this && !!input.checkValidity && !input.disabled;
      },this);
     
     form.reportValidity();
      siblings.forEach(function(input){
          input.disabled = false;
      });
      if (tmpForm) {
          tmpForm.before(this);
          tmpForm.remove();
      }
      this.focus();
      this.selectionStart = 0;
      return false;
  };
}
/** 
  Funciones utililes para formatear valores
**/
const isNumericInput = (event) => {
	const key = event.keyCode;
	return ((key >= 48 && key <= 57) || // Allow number line
		(key >= 96 && key <= 105) // Allow number pad
	);
};

const isModifierKey = (event) => {
	const key = event.keyCode;
	return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
		(key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
		(key > 36 && key < 41) || // Allow left, up, right, down
		(
			// Allow Ctrl/Command + A,C,V,X,Z
			(event.ctrlKey === true || event.metaKey === true) &&
			(key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
		)
};

const enforceFormat = (event) => {
	if(!isNumericInput(event) && !isModifierKey(event)){
		event.preventDefault();
	}
};
/** 
  Formatear input Telefono ARG
   uso: document.querySelector('#phone').addEventListener('keydown',enforceFormat)
        document.querySelector('#phone').addEventListener('keyup',formatToPhone)
**/
const formatToPhone = (event) => {
	if(isModifierKey(event)) {return;}

	// I am lazy and don't like to type things more than once
	const target = event.target;
	const input = event.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
	const zip = input.substring(0,2);
	const middle = input.substring(2,6);
	const last = input.substring(6,10);

	if(input.length > 6){target.value = `${zip} ${middle} ${last}`;}
	else if(input.length > 2){target.value = `${zip} ${middle}`;}
	else if(input.length > 0){target.value = `${zip}`;}
};
/** 
  Formatear input CUIT ARG
  uso:  document.querySelector('#cuit').addEventListener('keydown',enforceFormat)
        document.querySelector('#cuit').addEventListener('keyup',formatToCuit)
**/
const formatToCuit = (event) => {
	if(isModifierKey(event)) {return;} 
	const target = event.target;
	const input = event.target.value.replace(/\D/g,'').substring(0,11); 
	const zip = input.substring(0,2);
	const middle = input.substring(2,10);
	const last = input.substring(10,11);

	if(input.length > 9){target.value = `${zip}-${middle}-${last}`;}
	else if(input.length > 2){target.value = `${zip}-${middle}`;}
	else if(input.length > 0){target.value = `${zip}`;}
};
/** 
  Formatear Money
  uso:  formatMoney(value);
**/
function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}

//Solo permite introducir números.
function soloNumeros(e) {
  var key = window.event ? e.which : e.keyCode;
  if (key < 48 || key > 57) {
    //Usando la definición del DOM level 2, "return" NO funciona.
    e.preventDefault();
  }
}
/**
  Validamos que solo sea numero un input
  uso: validarNum('.soloNumero'); 
**/
function validarNum(identificador) {
  const inputs = document.querySelectorAll(identificador);
  if (inputs.length > 0) {
    inputs.forEach(element => {
      element.addEventListener("keypress", soloNumeros, false);
    });
  }
}

/**
  scrollTo
  uso:  
**/
const easeInCubic = function(t) {
  return t * t * t;
};

const scrollToElem = (
  startTime,
  currentTime,
  duration,
  scrollEndElemTop,
  startScrollOffset
) => {
  const runtime = currentTime - startTime;
  let progress = runtime / duration;

  progress = Math.min(progress, 1);

  const ease = easeInCubic(progress);

  window.scroll(0, startScrollOffset + scrollEndElemTop * ease);
  if (runtime < duration) {
    requestAnimationFrame(timestamp => {
      const currentTimes = timestamp || new Date().getTime();
      scrollToElem(
        startTime,
        currentTimes,
        duration,
        scrollEndElemTop,
        startScrollOffset
      );
    });
  }
};

function scrollBox(idElement) {
    const scrollEndElem = document.getElementById(idElement);
    requestAnimationFrame(timestamp => {
      const stamp = timestamp || new Date().getTime();
      const duration = 600;
      const start = stamp;
  
      const startScrollOffset = window.pageYOffset;
      const scrollEndElemTop = scrollEndElem.getBoundingClientRect().top;
  
      scrollToElem(start, stamp, duration, scrollEndElemTop, startScrollOffset);
    });
}


var eventClick = new Event('click');
document.dispatchEvent(eventClick);