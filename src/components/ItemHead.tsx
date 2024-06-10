interface Props {
  name: string;
  id: number;
  onChange: (newName: string) => void;
}

function ItemHead({ name, onChange, id }: Props) {
  return (
    <div>
      <button
        className="btn btn-sm btn-primary p-2"
        onClick={() =>
          (
            document.getElementById(`my_modal_${id}`) as HTMLDialogElement
          ).showModal()
        }
      >
        {name}
      </button>
      <dialog id={`my_modal_${id}`} className="modal">
        <div className="modal-box w-auto">
          <input
            className="input input-sm input-secondary"
            defaultValue={name}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTimeout(() => {
                  (
                    document.getElementById(`my_btn_${id}`) as HTMLButtonElement
                  ).click();
                }, 10);
              }
            }}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id={`my_btn_${id}`}>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default ItemHead;
