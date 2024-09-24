const gameArea = document.getElementById('game-area');
let currentElement = 'verde'; // Elemento seleccionado por defecto

class Aldeano {
  constructor(color, x, y) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.size = 30;
    this.health = 100; // Salud inicial
    this.hambre = 10; // Nivel de hambre
    this.sed = 10; // Nivel de sed
    this.amor = 0;
    this.guerra = 0;
    this.element = this.createElement();
    gameArea.appendChild(this.element);
    this.createBars(); // Llama a createBars aquí
    this.move();
    this.decreaseNeeds(); // Iniciar la disminución de necesidades
  }

  createElement() {
    const div = document.createElement('div');
    div.classList.add('aldeano', this.color);
    div.style.width = `${this.size}px`;
    div.style.height = `${this.size}px`;
    div.style.position = 'absolute';
    div.style.left = `${this.x}px`;
    div.style.top = `${this.y}px`;

    // Crear el texto de salud
    this.healthText = document.createElement('span');
    this.healthText.textContent = this.health;
    this.healthText.style.position = 'absolute';
    this.healthText.style.color = '#fff';
    this.healthText.style.fontWeight = 'bold';
    this.healthText.style.top = '10px'; // Ajusta la posición según necesites
    this.healthText.style.left = '50%';
    this.healthText.style.transform = 'translateX(-50%)';
    div.appendChild(this.healthText);

    this.element = div;
    return div;
  }

  createBars() {
    // Barra de hambre
    this.hambreBar = document.createElement('div');
    this.hambreBar.classList.add('bar', 'hambre');
    this.hambreBar.style.width = '100%';
    this.hambreBar.style.position = 'absolute';
    this.hambreBar.style.bottom = '-10px'; // Ajusta según sea necesario
    this.hambreBar.style.height = '5px';
    this.element.appendChild(this.hambreBar);

    // Barra de sed
    this.sedBar = document.createElement('div');
    this.sedBar.classList.add('bar', 'sed');
    this.sedBar.style.width = '100%';
    this.sedBar.style.position = 'absolute';
    this.sedBar.style.bottom = '-20px'; // Ajusta según sea necesario
    this.sedBar.style.height = '5px';
    this.element.appendChild(this.sedBar);

    this.updateBars(); // Actualiza las barras al crearlas
  }

  updateBars() {
    this.hambreBar.style.width = `${(this.hambre / 10) * 100}%`;
    this.sedBar.style.width = `${(this.sed / 10) * 100}%`;
  }

  move() {
    setInterval(() => {
      const randomX = Math.floor(Math.random() * 15) - 7;
      const randomY = Math.floor(Math.random() * 15) - 7;

      this.x += randomX;
      this.y += randomY;

      this.checkBounds();
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
      this.searchForResources();
      this.checkCollisions();
    }, 500);
  }

  checkBounds() {
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x > gameArea.offsetWidth - this.size) this.x = gameArea.offsetWidth - this.size;
    if (this.y > gameArea.offsetHeight - this.size) this.y = gameArea.offsetHeight - this.size;
  }

  searchForResources() {
    const resources = document.querySelectorAll('.comida, .agua');
    resources.forEach(resource => {
      const rect = resource.getBoundingClientRect();
      const distance = Math.hypot(this.x - rect.left, this.y - rect.top);

      if (distance < 30) {
        if (resource.classList.contains('comida')) {
          this.hambre = Math.min(this.hambre + 6, 10); // Aumenta 6 puntos de hambre
        }
        if (resource.classList.contains('agua')) {
          this.sed = Math.min(this.sed + 1, 10);
        }
        resource.remove();
        this.updateBars(); // Actualiza las barras después de consumir recursos
      }
    });
  }

  checkCollisions() {
    const aldeanos = document.querySelectorAll('.aldeano');
    aldeanos.forEach(other => {
      if (other !== this.element) {
        const rectOther = other.getBoundingClientRect();
        const distance = Math.hypot(this.x - rectOther.left, this.y - rectOther.top);
        if (distance < 30) {
          if (this.color !== other.classList[1]) {
            this.attack(other);
          } else {
            this.amor = Math.min(this.amor + 1, 10);
          }
        }
      }
    });
  }

  attack(other) {
    const enemyAldeano = Array.from(document.querySelectorAll('.aldeano')).find(aldeano => aldeano === other);
    if (enemyAldeano) {
      const enemyInstance = Aldeano.instances.find(aldeano => aldeano.element === enemyAldeano);
      if (enemyInstance) {
        enemyInstance.health -= 20; // Reducir la salud del enemigo
        enemyInstance.healthText.textContent = enemyInstance.health; // Actualizar texto de salud
        if (enemyInstance.health <= 0) {
          enemyInstance.element.remove(); // Eliminar el aldeano si la salud llega a cero
          Aldeano.instances = Aldeano.instances.filter(aldeano => aldeano !== enemyInstance);
        }
      }
    }
  }

  static instances = []; // Mantener un registro de todas las instancias de Aldeano

  decreaseNeeds() {
    setInterval(() => {
      if (this.hambre > 0) {
        this.hambre -= 4; // Disminuir hambre
      }
      if (this.sed > 0) {
        this.sed -= 4; // Disminuir sed
      }
      this.updateBars(); // Actualiza las barras de hambre y sed
    }, 1000); // Cada segundo
  }
}

// Función para generar elementos en el juego
function generateElement(type, x, y) {
  let newElement;

  if (type === 'verde' || type === 'rojo') {
    newElement = new Aldeano(type, x, y);
    Aldeano.instances.push(newElement); // Agregar a la lista de instancias
  } else {
    newElement = document.createElement('div');
    newElement.classList.add(type);
    newElement.style.left = `${x}px`;
    newElement.style.top = `${y}px`;
    gameArea.appendChild(newElement);
  }
}

// Manejo de clic en el área de juego
gameArea.addEventListener('click', (e) => {
  if (currentElement) {
    const x = e.clientX - gameArea.offsetLeft;
    const y = e.clientY - gameArea.offsetTop;
    generateElement(currentElement, x, y);
  }
});

// Botones para seleccionar el elemento
document.getElementById('green-btn').addEventListener('click', () => { currentElement = 'verde'; });
document.getElementById('red-btn').addEventListener('click', () => { currentElement = 'rojo'; });
document.getElementById('yellow-btn').addEventListener('click', () => { currentElement = 'comida'; });
document.getElementById('blue-btn').addEventListener('click', () => { currentElement = 'agua'; });
document.getElementById('gray-btn').addEventListener('click', () => { currentElement = 'piedra'; });
