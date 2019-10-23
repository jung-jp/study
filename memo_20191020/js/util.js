const sel = (v, el = document) => el.querySelector(v);
const selAll = (v, el = document) => el.querySelectorAll(v);
const _sel = el => typeof el === 'string' ? sel(el) : el;
const _selAll = el => typeof el === 'string' ? selAll(el) : Array.isArray(el) ? el : [el];
const addEvent= (s, e, f) => _selAll(s).forEach( (v) => v.addEventListener(e, f));
const removeEvent = (a, el, f) => _selAll(el).forEach(v => v.removeEventListener(a, f));
const hasClass = (el, cls) => el.className.search(new RegExp(cls)) !== -1;
const assignStyle = (props) => Object.entries(props).reduce((p, v) => p += `${v[0]}:${v[1]};`,'');

const draggable = (div = '.draggable', curosr = '.header') => {
    const element = document.querySelector(div);
    const targetEl = document.querySelector(curosr);
    let isMouseDown = false;         
    let startClientX;
    let startClientY;    
    let elementX;
    let elementY;

    targetEl.addEventListener('mousedown', (e) => {        
        console.log('mousedown');
        isMouseDown = true;
        
        elementX = parseInt(element.style.left) || 0;
        elementY = parseInt(element.style.top) || 0;
        startClientX = e.clientX;        
        startClientY = e.clientY;        
        
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    });

    const mousemove = (e) => {        
        if (!isMouseDown || !elementX) return;        
        element.style.left = (elementX + (e.clientX - startClientX)) + 'px';
        element.style.top = (elementY + (e.clientY - startClientY)) + 'px';
    }

    const mouseup = (e) => {        
        isMouseDown = false;        
        document.removeEventListener('mousemove', mousemove);        
    }  
     
}


const resizableDiv = (target, btn) => {
    const targetEl = document.querySelector(target);
    const btns = document.querySelectorAll(`${btn}`);
    let oriWidth = 0;
    let oriHeight = 0;
    let pageX = 0;
    let pageY = 0;

    btns.forEach((el) => {
        el.addEventListener('mousedown', (e) => {
            e.preventDefault();
            oriWidth = parseFloat(getComputedStyle(targetEl).getPropertyValue('width'));
            oriHeight = parseFloat(getComputedStyle(targetEl).getPropertyValue('height'));
            pageX = e.pageX;
            pageY = e.pageY;
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', resize);
            });
        });
    });

    const resize = (e) => {
        const minSize = 20;
        const width = oriWidth + (e.pageX - pageX);
        const height = oriHeight + (e.pageY - pageY)
        if (width > minSize) {
            targetEl.style.width = width + 'px'
        }
        if (height > minSize) {
            targetEl.style.height = height + 'px'
        }
    }
};
