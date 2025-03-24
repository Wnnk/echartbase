
export default {
  inserted(el, binding,vnde) {
    let scrollWrap = el.querySelector('.el-select-dropdown__list');
    const handle = () => {
      let scrollDistance = scrollWrap.scrollHeight - scrollWrap.scrollTop;
      if(scrollWrap.clientHeihgt + 6 > scrollDistance) {
        binding.value();
      }
    }
    scrollWrap.addEventListener('scroll', handle);
    el._hanlde = handle
  },

  unbind(el) {
    // 获取滚动容器dom
    let scrollWrap = el.querySelector('.el-select-dropdown .el-scrollbar .el-select-dropdown__wrap')
    // 解绑
    scrollWrap?.removeEventListener('scroll', el._hanlde)
    // 清空
    delete el._hanlde;
  }
}