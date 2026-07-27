let overlay = null;

export function createModal() {

    if (overlay) return;

    overlay = document.createElement("div");

    overlay.className = "modal-overlay";

    overlay.innerHTML = `

        <div class="modal-box">

            <div class="modal-header">

                <h3 id="modalTitle"></h3>

                <button
                    class="modal-close"
                    id="modalClose">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>

            <div
                class="modal-body"
                id="modalBody">

            </div>

            <div
                class="modal-footer"
                id="modalFooter">

            </div>

        </div>

    `;

    document.body.appendChild(overlay);

    overlay
        .querySelector("#modalClose")
        .addEventListener(
            "click",
            closeModal
        );

    overlay.addEventListener("click",(e)=>{

        if(e.target===overlay){

            closeModal();

        }

    });

}

export function showModal({

    title="",

    body="",

    buttons=[]

}){

    createModal();

    overlay
        .querySelector("#modalTitle")
        .innerHTML=title;

    overlay
        .querySelector("#modalBody")
        .innerHTML=body;

    const footer =
        overlay.querySelector("#modalFooter");

    footer.innerHTML="";

    buttons.forEach(btn=>{

        const button =
            document.createElement("button");

        button.className=
            `modal-btn ${btn.className||"modal-primary"}`;

        button.textContent=btn.text;

        button.onclick=()=>{

            btn.onClick?.();

        };

        footer.appendChild(button);

    });

    overlay.classList.add("show");

}

export function closeModal(){

    overlay.classList.remove("show");

}