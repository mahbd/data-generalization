import { create, Mutate, StoreApi, UseBoundStore } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

export interface ItemModel {
  id: number;
  name: string;
  children?: number[];
  parent: number;
  isOpened?: boolean;
}

const demoData = {
  maxId: 5,
  items: {
    1: {
      id: 1,
      name: "Example Level1",
      parent: 0,
      isOpened: true,
      children: [2],
    },
    2: {
      id: 2,
      name: "Example Level2",
      parent: 1,
      isOpened: true,
      children: [3],
    },
    3: {
      id: 3,
      name: "Example Level3",
      parent: 2,
    },
  },
};

interface Store {
  maxId: number;
  items: { [key: number]: ItemModel };
  loadData: () => void;
  saveData: (data: {}) => void;
  addItem: (item: ItemModel) => void;
  removeItem: (id: number, recursive?: boolean) => void;
  updateItem: (item: ItemModel) => void;
  getItem: (id: number) => ItemModel;
  getHierarchyJson: (id: number) => any;
  searchItems: (name: string) => ItemModel[];
  closeItem: (id: number) => void;
  closeAll: () => void;
  openItem: (id: number) => void;
  openRecursive: (id: number) => void;
}

const useItemStore: UseBoundStore<Mutate<StoreApi<Store>, []>> = create<Store>(
  (set) => ({
    ...demoData,

    loadData: () =>
      set((state) => {
        let data: any = localStorage.getItem("data");
        if (data !== null) {
          data = JSON.parse(data);
          return data;
        }
        return state;
      }),

    saveData: (data) => {
      const json = JSON.stringify(data);
      localStorage.setItem("data", json);
    },

    addItem: (item: ItemModel) =>
      set((state) => {
        const changed = {
          items: {
            ...state.items,
            [state.maxId + 1]: { ...item, id: state.maxId + 1 },
            [item.parent]: {
              ...state.items[item.parent],
              children: [
                ...(state.items[item.parent].children ?? []),
                state.maxId + 1,
              ],
            },
          },
          maxId: state.maxId + 1,
        };
        useItemStore.getState().saveData(changed);
        return changed;
      }),

    removeItem: (id: number) =>
      set((state) => {
        if (id === 1) {
          return state;
        }
        const item = state.items[id];
        if (item.children !== undefined) {
          item.children.forEach((child) =>
            useItemStore.getState().removeItem(child)
          );
        }
        const parent = state.items[item.parent];
        // @ts-ignore
        parent.children = parent.children?.filter((child) => child !== id);
        delete state.items[id];
        if (id == 1) {
          useItemStore.getState().addItem({
            id: 1,
            name: "Example",
            parent: 0,
          });
        }
        useItemStore
          .getState()
          .saveData({ items: state.items, maxId: state.maxId });
        return { items: state.items, maxId: state.maxId };
      }),

    updateItem: (item: ItemModel) =>
      set((state) => {
        const changed = {
          items: { ...state.items, [item.id]: item },
          maxId: state.maxId,
        };
        useItemStore.getState().saveData(changed);
        return changed;
      }),

    getItem: (id: number) => useItemStore.getState().items[id],

    getHierarchyJson: (id: number) => {
      const states = useItemStore.getState();
      const item = states.items[id];
      const result: { [key: string]: { [key: string]: string } } = {};
      const getRecursive = (
        id: number,
        level: number,
        root_key: string | undefined
      ): string[] => {
        const item = states.items[id];
        const to_return: string[] = [item.name];
        if (item.children !== undefined) {
          item.children.forEach((child) => {
            const returned = getRecursive(child, level + 1, item.name);
            to_return.push(...returned);
          });
        }
        if (root_key != undefined) {
          for (let i = 0; i < to_return.length; i++) {
            if (result[to_return[i]] === undefined) result[to_return[i]] = {};
            result[to_return[i]][`level${level}`] = root_key;
            result[to_return[i]][`level${level + 1}`] = item.name;
          }
        }
        return to_return;
      };
      getRecursive(id, -1, undefined);
      return result;
    },

    searchItems: (name: string) => {
      const items: ItemModel[] = [];
      (Object.values(useItemStore.getState().items) as ItemModel[]).forEach(
        (item) => {
          if (item.name.toLowerCase().includes(name.toLowerCase())) {
            items.push(item);
          }
        }
      );
      return items;
    },

    closeItem: (id: number) =>
      set((state) => {
        const item: any = state.items[id];
        if (item === undefined) {
          throw new Error(`Item with id ${id} not found`);
        }
        item.isOpened = false;
        return { items: { ...state.items, [item.id]: item } };
      }),

    closeAll: () =>
      set((state) => {
        Object.values(state.items).forEach((item) => {
          item.isOpened = false;
        });
        return { items: { ...state.items } };
      }),

    openItem: (id: number) =>
      set((state) => {
        const item: any = state.items[id];
        if (item === undefined) {
          throw new Error(`Item with id ${id} not found`);
        }
        item.isOpened = true;
        return { items: { ...state.items, [item.id]: item } };
      }),

    openRecursive: (id: number) =>
      set((state) => {
        const item: any = state.items[id];
        if (item === undefined) {
          throw new Error(`Item with id ${id} not found`);
        }
        item.isOpened = true;
        const parent = state.items[item.parent];
        if (parent !== undefined) {
          useItemStore.getState().openRecursive(parent.id);
        }
        return { items: { ...state.items, [item.id]: item } };
      }),
  })
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("ItemStore", useItemStore);
}

export default useItemStore;
