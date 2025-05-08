import { createApp, h, render, ref } from "vue";
import { ElDialog } from "element-plus";
import type { DefineComponent } from "vue";


/** 
 * @description: 函数式弹窗,将弹窗Promise化
 * @param {any} component 弹窗组件
 * @param {any} config 弹窗配置
 * @return {Promise} 返回Promise
 * @example
 *   const dialog =  createDialog(component, config);
 *   await dialog({})
  */
export function createDialog(component: any, config: any) {
  return () => {
    return new Promise((resolve, reject) => {
      const visiable = ref(true);
      const dialogUnMount = () => {
        visiable.value = false;
      }

      /* 1.创建节点 */
      let el = document.createElement("div");
      /* 2.创建实例 */
      const app = createApp({
        onUnmounted() {
          if(!el) return;
          el.parentNode && el.parentNode.removeChild(el);
        },
        render() {
          console.log("render",config);
          return h(ElDialog, {
            modelValue: visiable.value,
            title: config.title,
            onClose: () => {
              reject({
                type: 'dialogClose',
              });
              dialogUnMount();
              console.log("close");
            },
            onClosed: () => {
              app.unmount();
              console.log("closed");
            }
          },{
            default: () => h(component, {
              onCancel: () => {
                reject({
                  type: 'dialogCancel'
                })
                dialogUnMount();
                console.log("cancel");
              },
              onOk: (data: any) => {
                
                resolve(data);
                dialogUnMount();
                console.log("ok", data);
              }
            })
          })
        }
      });
     
      /* 3.挂载 */
      app.mount(el);
      /* 4.布局挂载 */
      document.body.appendChild(el);
    });
  }
}