<template>
  <div class="page-detail">
    <el-row>
      <el-col :span="24">
        <crumbs
          :keyword="keyword"
          :type="type"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <summa :meta="product"/>
      </el-col>
    </el-row>
    <el-row class="m-title">
      <el-col :span="24">
        <h3>商家商品信息</h3>
      </el-col>
    </el-row>
    <!--在可以购买或者未登录的时候才显示这部分-->
    <el-row v-if="canOrder || !login">
      <el-col :span="24">
        <list
          v-if="login"
          :list="list"/>
        <div
          v-else
          class="deal-need-login">
          <img
            src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png"
            alt="登录查看">
          <span>请登录后查看详细团购优惠</span>
          <el-button
            type="primary"
            round>
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Crumbs from '@/components/detail/crumbs.vue';
import Summa from '@/components/detail/summary.vue'
import List from '@/components/detail/list.vue'
export default {
  components:{
    Crumbs,
    Summa,
    List
  },
  computed:{
    canOrder:function(){
      return this.list.filter(item=>item.photos.length).length
    }
  },
  async asyncData(ctx){
    // 在服务端运行，此时只能通过ctx.query来拿到keyword
    let {keyword,type}=ctx.query;
    // 解构赋值
    let {status,data:{product,more:list,login}}=await ctx.$axios.get('/search/products',{
      params:{
        keyword,
        type,
        city:ctx.store.state.geo.position.city
      }
    })
    if(status===200){
      return {
        // asyncData中返回的数据不用在data部分再声明
        keyword,
        product,
        type,
        // list即每个商家店铺内的商品列表（本地数据库暂时未添加该字段）
        list,
        login
      }
    }else{
      return {
        keyword,
        product:{},
        type,
        list:[],
        login:false
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/detail/index.scss";
</style>
