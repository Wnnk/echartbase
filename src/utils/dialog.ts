import { ElDialog } from "element-plus";
import { createApp, h } from "vue";
import { ref } from "vue";
import { loadPlugins } from "./loadPlugins";
import 'element-plus/es/components/dialog/style/css';

export function renderDialog(component: any, props: any, modalProps: any) {
  const open = ref(true);

  const dialog = () => h(
    ElDialog, 
    { ...modalProps,
      modelValue:open.value,
      modal:true,
      onOpened:handleOpen,
      onClosed:handleClose,
    }, 
    {  default: () => h(component, props) }
  );
  
  const app = createApp(dialog);
  loadPlugins(app);
  const handleClose = () => {
    open.value = false;
    app.unmount();
    document.body.removeChild(div);
    console.log("close");
  };
  const handleOpen = () => {
    open.value = true;
    console.log("open");
  }
  const div = document.createElement("div");
  document.body.appendChild(div);
  app.mount(div);
}