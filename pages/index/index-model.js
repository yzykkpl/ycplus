import { Base } from '../../utils/base.js';

class Home extends Base {

  constructor() {
    super()
  }
  getProduct(callBack) {
    var options = {
      url: 'buyer/product/list',
      method: 'GET',
      sCallBack: function (res) {
        callBack && callBack(res)
      }
    }
    this.request(options)
  }


}
export { Home };