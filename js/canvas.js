function canvasApp() {

    let canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        isDown = false,
        windowHeight = window.innerHeight,
        windowWidth = window.innerHeight,
        colorBtns = ['black', 'red', 'green', 'blue', 'yellow', 'transparent'];

    canvas.style.position = 'absolute';
    canvas.height = windowHeight;
    canvas.width = windowWidth;
    canvasPosition = canvas.getBoundingClientRect();
    context.lineWidth = 2;

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        context.lineWidth = 2;
    }

    canvas.onmousedown = function (e) {
        e = e || window.event;

        GetStartPoints(e);
    };

    canvas.onmouseup = function (e) {
        e = e || window.event;

        GetEndPoints(e);

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    };

    function GetStartPoints(e) {
        x1 = e.pageX - canvasPosition.left;
        y1 = e.pageY - canvasPosition.top;
    }

    function GetEndPoints(e) {
        x2 = e.pageX - canvasPosition.left;
        y2 = e.pageY - canvasPosition.top;
    }


    const colorBtnHandler = colorBtns => {
        colorBtns.forEach(color => {
            let currentBtn = document.getElementById(color);
            currentBtn.addEventListener('click', () => {
                draw(color, currentBtn);
            }, false)
        });
    };

    const draw = (color, button) => {

        if (!canvasStatus.active) {
          swal('Canvas Not Active', 'To be able to draw, you must activate the canvas. Click the canvas button in the top navigation.', "warning")
          return;
        }

        if (color === 'transparent') {
          context.lineWidth = 40;
          context.globalCompositeOperation = "destination-out";
        } else {
          context.strokeStyle = color;
          context.lineWidth = 2;
          context.globalCompositeOperation = "source-over";
        }
        changeBtnFocus(button);
    };

    const changeBtnFocus = button => {
        document.querySelectorAll('.colors').forEach( btn => {
            btn.style.color = '';
        });
        button.style.color = (button.id === 'transparent') ? 'white' : button.id;
    };
    colorBtnHandler(colorBtns);
}
