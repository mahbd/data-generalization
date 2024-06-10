import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface Props {
  onChange: (itemName: string) => void;
  id: number;
}

function AddItem({ onChange, id }: Props) {
  const [value, setValue] = useState("");
  return (
    <div>
      <button
        className="btn btn-sm btn-primary p-2"
        onClick={() =>
          (
            document.getElementById(`my_modal_${id + 3}`) as HTMLDialogElement
          ).showModal()
        }
      >
        <AiOutlinePlus />
      </button>
      <dialog id={`my_modal_${id + 3}`} className="modal">
        <div className="modal-box w-auto">
          <input
            className="input input-sm input-secondary"
            placeholder="Item Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onChange(value);
                setValue("");
                setTimeout(() => {
                  (
                    document.getElementById(
                      `close_btn_${id + 3}`
                    ) as HTMLButtonElement
                  ).click();
                }, 100);
              }
            }}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id={`close_btn_${id + 3}`}>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default AddItem;
