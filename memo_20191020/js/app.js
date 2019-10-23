/**
 * 최대 메모 생성 갯수
 */
const maxMemoCount = 100;
/**
 * 드래그용 변수
 */
const drag =  {startX:0, startY:0};
/**
 * localStorage 모델객체
 */
const model = new Model();

/**
 * 메모로드
 */
document.addEventListener("DOMContentLoaded", () => {
    loadMemo();
});

/**
 * 우클릭시 메모 생성.
 */
addEvent('.wrap', 'mousedown', (e) => {

    if(!hasClass(e.target, 'wrap')) return
    
    if (!(e.button == 2 || e.which == 3)) return

    if(model.getTotalCount()>= maxMemoCount) {
        alert(`메모는 최대 ${maxMemoCount}개 까지 생성 가능 합니다.`);
        return;
    }

    const props = {
        id : 'memo_' + (new Date().getTime()),
        text : '',
        zIndex: model.getMaxIndex(),
        top: e.offsetY + 'px',
        left: e.offsetX + 'px',
        width:'200px',
        height:'100px'
    }
    createMemo(new Memo(...Object.values(props)));
});

/**
 * 우큭릭 컨텍스트 메뉴 사용안함.
 */
addEvent('.wrap', 'contextmenu', () => {    
    event.preventDefault();
});

/**
 * 메모 리로드
 */
const loadMemo = () => {
    model.initZIndex();
    Object.values(model.getAll()).forEach((memo) => {
        sel('.wrap').insertAdjacentHTML('beforeend', getTemplate(memo));
        resizableDiv(`#${memo.id} .textarea`, `#${memo.id} .btn_size`);
        memoEvent(memo);
    });
}

/**
 * 메모 생성
 * @param {*} memo 
 */
const createMemo = (memo) => {
    sel('.wrap').insertAdjacentHTML('beforeend', getTemplate(memo));
    memoEvent(memo);
    model.insert(memo);
}

/**
 * 메모 html
 * @param {*} props 
 */
const getTemplate = (props) => {
    const {id = '', text = '', zIndex = 0, top = 0, left = 0, width='200px', height='100px'} = props;
    return `
        <div class="memo" id="${id}" style="${assignStyle({top, left, 'z-index':zIndex})}" >
            <div class="header">
                <h1 class="blind">메모장</h1>
                <button class="btn_close"><span class="blind">닫기</span></button>
            </div>
            <div class="content">
                <div class="textarea" contenteditable="true" style="${assignStyle({width, height})}">${text}</div>
                <button class="btn_size"><span class="blind">메모장 크기 조절</span></button>
            </div>
        </div>
    `;
}

/**
 * 메모 이벤트 등록
 * @param {*} memo 
 */
const memoEvent = (memo) => {

    /**
     * 메모 리사이즈
     */
    resizableDiv(`#${memo.id} .textarea`, `#${memo.id} .btn_size`);

    draggable(`#${memo.id}.memo`, `#${memo.id} .header`);

    /**
     * 메모 텍스트 업데이트
     */
    addEvent(`#${memo.id}`, 'keyup', (e) => {
        const {currentTarget:el} = e;
        model.update(el.id, {'text' : el.querySelector('.textarea').innerHTML});
    });

    /**
     * 메모 정보 업데이트
     */
    addEvent(`#${memo.id}`, 'click', (e) => {
        const {currentTarget:el} = e;
        const textarea = sel('.textarea', el);
        const item = model.get(memo.id);
        const zIndex = model.getMaxIndex(item.zIndex);
        model.update(el.id, {
            'top' : el.style.top,
            'left' : el.style.left,
            'width' : textarea.style.width,
            'height' : textarea.style.height,
            'zIndex' : zIndex
        });
        el.style.zIndex = zIndex;
    });

    /**
     * 메모 닫기
     */
    addEvent(`#${memo.id} .btn_close`, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const {currentTarget:el} = e;
        const memoEl = el.closest('.memo');
        memoEl.remove();
        model.delete(memoEl.id);
    });    
}
