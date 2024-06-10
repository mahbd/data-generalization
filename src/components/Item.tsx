import { FcCollapse } from "react-icons/fc";
import ItemHead from "./ItemHead";
import AddItem from "./AddItem";
import { AiFillDelete } from "react-icons/ai";
import useItemStore, { ItemModel } from "./ItemStore";

interface Props {
  itemId: number;
}

const Item = ({ itemId }: Props) => {
  const data = useItemStore((state) => state.items[itemId]) as ItemModel;
  const {
    addItem,
    updateItem,
    removeItem,
    openRecursive,
    closeItem,
    closeAll,
  } = useItemStore((state) => ({
    removeItem: state.removeItem,
    addItem: state.addItem,
    updateItem: state.updateItem,
    getItem: state.getItem,
    openRecursive: state.openRecursive,
    closeItem: state.closeItem,
    closeAll: state.closeAll,
  }));

  return (
    data && (
      <div className="mt-3">
        <div className="flex items-center gap-3">
          {data.children && data.children.length > 0 && (
            <button
              className="btn btn-sm btn-primary p-2"
              onClick={() => {
                if (data.isOpened) {
                  closeItem(data.id);
                } else {
                  openRecursive(data.id);
                }
              }}
            >
              <FcCollapse
                style={{
                  transform: `rotate(${data.isOpened ? 0 : 180}deg)`,
                }}
              />
            </button>
          )}
          {(!data.children || data.children.length === 0) && (
            <span className="ps-5 text-white"></span>
          )}

          <ItemHead
            name={data.name}
            id={data.id}
            onChange={(newName: string) => {
              const newItem = { ...data, name: newName };
              updateItem(newItem);
            }}
          />

          <AddItem
            onChange={(itemName: string) => {
              const newItem = {
                name: itemName,
                id: data.id + 1,
                parent: data.id,
              };
              addItem(newItem);
              closeAll();
              openRecursive(data.id);
            }}
            id={data.id + 1}
          />

          <button
            className="btn btn-sm btn-danger p-2"
            onClick={() => {
              removeItem(data.id);
            }}
          >
            <AiFillDelete color={"red"} />
          </button>
        </div>
        <div
          style={{
            margin: "10px",
            paddingLeft: "30px",
            display: data.isOpened ? "block" : "none",
          }}
        >
          {data.children &&
            data.children.length > 0 &&
            data.children.map((child) => <Item key={child} itemId={child} />)}
        </div>
      </div>
    )
  );
};

export default Item;
