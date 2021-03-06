import Router from 'koa-router';
import axios from './utils/axios'
import Province from '../dbs/models/province'
import Menu from '../dbs/models/menu'
import City from '../dbs/models/city'
import sign from './utils/sign'
let router = new Router({prefix: '/geo'})
// 获取城市ip地址
router.get('/getPosition', async (ctx) => {
  /* let {
    status,
    data: {
      province,
      city
    }
  } = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      province,
      city: city?city:'烟台'
    }
  } else {
    ctx.body = {
      province: '山东',
      city: '烟台'
    }
  } */
  ctx.body = {
    province: '山东',
    city: '烟台'
  }
})

router.get('/province', async (ctx) => {
  // 1. 操作本地数据库的方式
   let province = await Province.find()
   ctx.body = {
     province: province.map(item => {
       return {
         id: item.id,
         name: item.value[0]
       }
     })
   }
  // 2. 通过请求线上服务的方式
  /* let {status, data: {
      province
    }} = await axios.get(`http://cp-tools.cn/geo/province?sign=${sign}`)
  ctx.body = {
    province: status === 200
      ? province
      : []
  } */
})

router.get('/province/:id', async (ctx) => {
  let city = await City.findOne({id: ctx.params.id})
  ctx.body = {
    code: 0,
    city: city.value.map(item => {
      return {province: item.province, id: item.id, name: item.name}
    })
  }
  // let {status, data: {
     // city
    // }} = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`)
  // if (status === 200) {
    // ctx.body = {
      // city
   //  }
  // } else {
    // ctx.body = {
      // city: []
   // }
  // }
})

router.get('/city', async (ctx) => {
  let city = []
  let result = await City.find()
  result.forEach(item => {
    city = city.concat(item.value)
  })
  ctx.body = {
    code: 0,
    city: city.map(item => {
      return {
        province: item.province,
        id: item.id,
        name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
          ? item.province
          : item.name
      }
    })
  }
  // let {status, data: {
      // city
    // }} = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`);
  // if (status === 200) {
    // ctx.body = {
      // city
    // }
  // } else {
   //  ctx.body = {
     //  city: []
   //  }
  // }
})

router.get('/hotCity', async (ctx) => {
  // let list = [
  //   '北京市',
  //   '上海市',
  // ]
  // let result = await City.find()
  // let nList = []
  // result.forEach(item => {
  //   nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  // })
  // ctx.body = {
  //   hots: nList
  // }
  let {status, data: {
      hots
    }} = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})

router.get('/menu', async (ctx) => {
  // 请求本地数据库
  const result = await Menu.find()
  ctx.body = {
    menu: result[0].menu
  }
  // 请求第三方云服务接口
  /*let {status, data: {
      menu
    }} = await axios.get(`http://cp-tools.cn/geo/menu?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }*/
})

export default router;
