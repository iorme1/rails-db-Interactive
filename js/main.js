const models = {
  modelCount: 0
};

window.onload = function () {
    document.querySelector('.controls').addEventListener('click', modelMenuHandler, false);
    document.getElementById('model-files').addEventListener('change', handleModelFiles, false);
    document.getElementById('schema-file').addEventListener('change', handleSchemaFile, false);
    document.getElementById('toggle-controls').addEventListener('click', toggleControlMenu);
    document.getElementById('toggle-canvas').addEventListener('click', toggleCanvas);
    canvasApp();
}

const modelMenuHandler = e => {
    e = e || window.event

    if (e.target !== e.currentTarget) {
      let button = e.target.id;

      switch (button) {
          case 'draggable':
              dragActive(button);
              break;
          case 'resizeable':
              resizeActive(button);
              break;
          case 'rotater-arrow':
              addArrow();
              break;
          case 'enlarge-model':
              resizeModel(button);
              break;
          case 'shrink-model':
              resizeModel(button);
              break;
          case 'rotate-model':
              modelRotator();
              break;
      }
    }
    e.stopPropagation();
};

const toggleControlMenu = () => {

    document.querySelector('.controls').classList.toggle('hide-controls');
};

function toggleCanvas() {

    document.getElementById('canvas').classList.toggle('hide');

    if (canvas.classList.contains('hide')) {
      this.style.background = 'white'
      canvasStatus.active = false;
    } else {
      this.style.background = '#99e600';
      canvasStatus.active = true;
    }
}


const dragActive = button => {

    if (models.modelCount === 0) {
      swal('No models available', 'Please upload your Rails model files.', "warning");
      return;
    }
    // noDrag is a boolean that checks if models are currently draggable or not by checking an arbitrary model's classlist
    let noDrag = document.getElementsByClassName('model')[0].classList.contains('nodrag');
    let currentBtn = document.getElementById(`${button}`);

    if (!noDrag) {
      // exit function if the models are already draggable
      return;
    }

    document.getElementById('resizeable').style.background = 'white';
    currentBtn.style.background = '#99e600';
    document.querySelectorAll('.model').forEach(m => m.classList.remove('nodrag') );
};


const resizeActive = button => {
    //boolean to test to see if models are currently draggable
    if (document.getElementsByClassName('model')[0]) {
      let noDrag = document.getElementsByClassName('model')[0].classList.contains('nodrag');
      let models = document.querySelectorAll('.model');
      let currentBtn = document.getElementById(`${button}`);

      if (noDrag) {
        return;
        // elements are already resizeable / not draggable. so we do nothing and exit function
      }

      document.getElementById('draggable').style.background = 'white';
      currentBtn.style.background = '#99e600';
      models.forEach( m => m.classList.add('nodrag') );
    } else {
      swal("No Active Models", "Please upload model files and schema file.", "warning");
    }

};


const addArrow = () => {

    let arrows = document.querySelector('.arrows');
    let arrow = document.createElement('div');
    arrow.classList.add('arrow');
    arrow.innerHTML = '&#8594;';
    arrows.appendChild(arrow);
    arrow.ondblclick = rotateArrow;
    dragElement(arrow);
};


const Degrees = {
    arrowDegrees: 0,
    modelDegrees: 0
};


function rotateArrow() {
    Degrees.arrowDegrees += 45;
    this.style.transform = "rotate(" + Degrees.arrowDegrees + "deg)";
}


const resizeModel = button => {

    if (models.modelCount === 0) {
      swal('No models available', 'Please upload your Rails model files.', "warning");
      return;
    }

    let currentBtn = document.getElementById(`${button}`);
    let modelName = document.querySelector('.selected-model').innerHTML;
    let modelClassName = pluralize(modelName.toLowerCase());
    let modelTitle = document.querySelector(`.${modelClassName}`).querySelector('.model-title');
    let model = document.querySelector(`.${modelClassName}`)

    let font = window.getComputedStyle(modelTitle, null).getPropertyValue('font-size');
    let currentFontSize = parseInt(font);

    let width = window.getComputedStyle(model, null).getPropertyValue('width');
    let currentWidth = parseInt(width);
    let height = window.getComputedStyle(model, null).getPropertyValue('height');
    let currentHeight = parseInt(height);


    if (currentBtn.id === 'enlarge-model') {
      currentFontSize+=3;
      currentHeight+=10
      currentWidth+=15

    } else {
      currentFontSize-=3;
      currentHeight-=10
      currentWidth-=15
    }

    modelTitle.style.fontSize = currentFontSize.toString() + 'px';
    model.style.width = currentWidth.toString() + 'px';
    model.style.height = currentHeight.toString() + 'px';
    modelTitle.style.fontSize = currentFontSize.toString() + 'px';
};


const modelRotator = () => {

    let modelName = document.querySelector('.selected-model').innerHTML;
    let modelClassName = pluralize(modelName.toLowerCase());
    let model = document.querySelector(`.${modelClassName}`);

    Degrees.modelDegrees += 45;
    model.style.transform = "rotate(" + Degrees.modelDegrees + "deg)";
};


const canvasStatus = {
  active: false
}

const handleModelFiles = (evt) => {

    let files = evt.target.files;
    models.modelCount = files.length;

    for (let i = 0, f; f = files[i]; i++) {

        let reader = new FileReader();

        reader.onload = (theFile => {
          return e => {

              let modelFileLines = e.target.result.split('\n'); // used to iterate through model file line by line
              let model = ModelData(models.modelCount, modelFileLines);
              let modelContainer = modelBuilder(model);
              cssHandler(model, modelContainer);
              document.getElementById('db-models').appendChild(modelContainer);

          }
        })(f);
        reader.readAsText(f);
      }
  };


const ModelData = (modelCount, modelFileLines) => {

    let model = {};

    model.title = getModelName(modelFileLines);
    model.associations = getAssociations(modelFileLines);

    //styles based on amount of models to be populated
    model.width = getWidth(modelCount);
    model.height = getHeight(modelCount);
    model.font = getFontSize(modelCount);
    model.left = getLeft();
    model.top = getTop();

    return model;
};


const getModelName = modelFileLines => {

    let modelName;

    for (let i = 0; i < modelFileLines.length; i++) {
      // regex removes extra white space
      let modelFileWords = modelFileLines[i].replace(/\s+/g, " ").replace(/^\s|\s$/g, "").split(' ');
      if (modelFileWords[0] === 'class'){
        // next element in the modelFileLine array would be the model name that we want to grab
          modelName = modelFileWords[1];
          break;
      }
    }
    return modelName;
};


const getAssociations = modelFileLines => {

    let modelAssociations = [];

    modelFileLines.forEach( line => {
      // regex removes extra white space
      let modelFileWords = line.replace(/\s+/g, " ").replace(/^\s|\s$/g, "").split(' ');
        if (
            modelFileWords[0] === 'belongs_to' ||
            modelFileWords[0] === 'has_one' ||
            modelFileWords[0] === 'has_many' ||
            modelFileWords[0] === 'has_and_belongs_to_many'
          ) {
            modelAssociations.push(line);
         }
    });
    return modelAssociations;
};


const modelBuilder = (model) => {

  let modelContainerHTML = createModel(model.title);

  if (model.associations.length >= 1) {
      model.associations.forEach(asc => {
          let associationHTML = createAssociation(asc);
          modelContainerHTML.appendChild(associationHTML);
      });
    }
   return modelContainerHTML;
};


const createModel = modelName => {

    let modelContainer = document.createElement('div');
    let modelTitle = document.createElement('p');
    modelContainer.className = 'model ' + pluralize(modelName.toLowerCase());
    modelTitle.className = 'model-title';
    modelTitle.textContent = modelName;
    modelContainer.appendChild(modelTitle);
    modelContainer.addEventListener('dblclick', showInfo);

    return modelContainer;
};


const createAssociation = association => {

    let associationElement = document.createElement('p');
    let associationText = document.createTextNode(association);
    associationElement.className = 'associations';
    associationElement.appendChild(associationText);

    return associationElement;
};


const cssHandler = (model, modelContainer) => {

    modelContainer.style.width = model.width;
    modelContainer.style.height = model.height;
    modelContainer.style.left = model.left + 'px';
    modelContainer.style.top = model.top + 'px';
    modelContainer.querySelector('.model-title').style.fontSize = model.font;

    dragElement(modelContainer); // makes element draggable
};


const modelPositions = {
    left: 100,
    top: 75
};


const getHeight = (modelCount) => {

    let height;
    if (modelCount <= 20) {
      height = '66px';
    } else if (modelCount >= 21 && modelCount <= 31) {
       height = '36px';
    } else {
      height = '32px';
    }
    return height;
};


const getWidth = (modelCount) => {

    let width;
    if (modelCount <= 20) {
      width = '120px';
    } else if (modelCount >= 21 && modelCount <= 31) {
       width = '111px';
    } else {
      width = '105px';
    }
    return width;
};


const getFontSize = (modelCount) => {

    if (modelCount <= 20) {
      return '12px';
    } else if (modelCount >= 21 && modelCount <= 31) {
       return '14px';
    } else {
      return '12px';
    }
};


const getTop = () => {

    let bodyWidth = document.querySelector('.main').offsetWidth;
    if (modelPositions.left >= (bodyWidth - 500)) {
        modelPositions.top += 50;
    }
    return modelPositions.top;
};


const getLeft = () => {

    let bodyWidth = document.querySelector('.main').offsetWidth;
    modelPositions.left += 160;
    if (modelPositions.left >= (bodyWidth - 350)) {
        modelPositions.left = 235;
    }
    return modelPositions.left;
};


const handleSchemaFile = (evt) => {

    const files = evt.target.files;
    const reader = new FileReader();
    reader.onload = (e) => {
        // removes extra white spaces and splits schema file into words
        let schemaFileWords = e.target.result.replace(/\s+/g, " ").replace(/^\s|\s$/g, "").split(' ');
        let currentTable;

        schemaFileWords.forEach((word,i) => {
              if (word === 'create_table' ) {
                 // Regex removes commas, quotes, and underlines. model class names are now targetable.
                 currentTable = schemaFileWords[i+1].replace(/['"]+/g, '').slice(0,-1).replace(/['_]+/g, '');
              }
              if (word.startsWith('t.')) {
                  // schema file attribute lines start with "t." i.e "t.string". We want this datatype and following value
                  let datatype = word;
                  let value = schemaFileWords[i+1];
                  handleAttribute(currentTable, datatype, value);
              }
        });
    };
   reader.readAsText(files[0]);
};


const handleAttribute = (currentTable, datatype, value) => {

    let model = document.querySelector(`.${currentTable}`);
    if (model) {
        let attributeHTML = parseAttr(datatype, value);
        model.appendChild(attributeHTML);
    }
};


const parseAttr = (datatype, value) => {
    // data-type without 't.' and following value
    let attribute = datatype.slice(2, datatype.length) + " " + value;
    let attributeHTML = createAttr(attribute);

    return attributeHTML;
};


const createAttr = attribute => {

    let text = document.createTextNode(attribute);
    let attrContainer = document.createElement('p');
    attrContainer.appendChild(text);
    attrContainer.className = "attributes";

    return attrContainer;
};


function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;

      pos3 = e.clientX;
      pos4 = e.clientY;

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      if (elmnt.classList.contains('nodrag')) {
        return;
      }
      e = e || window.event;

      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
}

/*
 using 'function' syntax here to resolve "this"
 not being the clicked on model that excecutes this function
 */
function showInfo() {

    let associationsPad = document.getElementById('assoc-pad');
    let attributesPad = document.getElementById('attr-pad');
    let currentModel = this;

    // clear out previous model info
    associationsPad.innerHTML = "";
    attributesPad.innerHTML = "";

    // sets the model's name to be displayed in the 'selected-model' div
    let displayName = document.querySelector('.selected-model');
    displayName.innerHTML = currentModel.querySelector('.model-title').innerHTML;

    let associations = readAssociations(currentModel);
    let attributes = readAttributes(currentModel);

    associations.forEach( asc => associationsPad.appendChild(asc) );
    attributes.forEach( att => attributesPad.appendChild(att) );

    if ( attributesPad.innerHTML === "" ) {
        attributesPad.innerHTML = "No Attributes Found";
    }
    if (associationsPad.innerHTML === "") {
        associationsPad.innerHTML = "No Associations Found";
    }

    $('#assoc-attr-modal').modal('show');
    showTotalAssoc(currentModel); //display the total count of associations
}


const readAssociations = currentModel => {

    let associations = currentModel.querySelectorAll('.associations');
    let associationElements = [];

    associations.forEach( asc => {
        let associationHTML = document.createTextNode(asc.innerHTML);
        let p = document.createElement('p');
        p.className = "assoc-info";
        p.appendChild(associationHTML);
        associationElements.push(p);
        p.addEventListener('click', findConnection);
     });

    return associationElements;
};


const readAttributes = currentModel => {

    let attributes = currentModel.querySelectorAll('.attributes');
    let attributeElements = [];

    attributes.forEach( att => {
        let attributeHTML = document.createTextNode(att.innerHTML);
        let p = document.createElement('p');
        p.appendChild(attributeHTML);
        attributeElements.push(p);
    });

    return attributeElements;
};

// counts the total number of models that have associations to our current model
const showTotalAssoc = currentModel => {
     // classList[1] is the identifying class of the model
    let modelClass = currentModel.classList[1]
    let associations = Array.from(document.querySelectorAll('.associations'));

    let numOfAssociations = countAssociations(modelClass, associations)
    document.querySelector('.total-associations').innerHTML = numOfAssociations + " associations"
};


const countAssociations = (modelClass, associations) => {
    /* filters the associations for references of pluralized or singular version of model name
     or any association on the current model.  */
    let associationsTo = associations.map(parseAssociation)
                        .filter(asc =>
                            asc.includes(pluralize.singular(modelClass)) ||
                            asc.includes(modelClass)
                        ).length;

    let currentModel = document.querySelector(`.${modelClass}`);
    let associationsFrom = currentModel.querySelectorAll('.associations').length;

    return associationsTo + associationsFrom;
};

/* using 'function' syntax to resolve 'this' to be the clicked
element that executed this function */
function findConnection() {

    let models = document.querySelectorAll('.model');
    let associationPad = document.getElementById('assoc-pad');
    let association = this;
    let associationWords = parseAssociation(association).split(' ')
    // highlights the associated model(s) by iterating
    // through the words in the association itself and checking it against every models classname
    associationWords.forEach( word => {
        models.forEach( model => {
          if (
            model.classList[1] == pluralize.singular(word)
            || model.classList[1] == pluralize(word)
          )
            {
              model.classList.add('highlight')
              setTimeout( () => {
                model.classList.remove('highlight')
              }, 3000);
            }
        });
    });
}

const parseAssociation = association =>   association.innerHTML.replace(/['_]+/g, '')
                                          .replace(/[',]+/g, '').replace(/[':]+/g, '')
                                          .replace(/\s+/g, " ").replace(/^\s|\s$/g, "")
