<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>地质大数据集成综合服务平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu index="0">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-picture-outline-round"></i>
              <!-- 文本 -->
              <span>三维地球</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item index="/welcome" @click="saveNavState('/welcome')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>三维地球</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <div class="earth" :style="{ width: widthpercent }">
          <div ref="earthContainer" id="main" class="earthContainer"></div>
        </div>
        <div ref="routerView" class="routerView" v-bind:class="{displayNone:isDisplay}">
          <!-- 路由占位符 -->
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      widthpercent: '90%',
      // eslint-disable-next-line vue/no-reserved-keys
      _earth: undefined, // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
      // eslint-disable-next-line vue/no-reserved-keys
      _bgImagery: undefined,
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      isDisplay: true
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  // 1.1 资源创建
  mounted() {
    // eslint-disable-next-line no-undef
    XbsjEarthUI.create('main').then(earthUI => {
      window.uia = earthUI

      earthUI.earth.sceneTree.root = {
        children: [
          {
            title: '新建场景',
            children: [
              {
                czmObject: {
                  name: '谷歌影像',
                  xbsjType: 'Imagery',
                  xbsjImageryProvider: {
                    XbsjImageryProvider: {
                      url:
                        '//www.google.cn/maps/vt?lyrs=s,h&gl=CN&x={x}&y={y}&z={z}',
                      srcCoordType: 'GCJ02',
                      dstCoordType: 'WGS84'
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    })
  },
  // 1.2 资源销毁
  beforeDestroy() {
    // vue程序销毁时，需要清理相关资源
    this._earth = this._earth && this._earth.destroy()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const userid = window.sessionStorage.getItem('userid')
      const data = await this.$http.get('api/vertify/getMenus/' + userid)
      if (data.status !== 200) return this.$message.error('获取菜单失败')
      this.menulist = data.data
      // console.log(data.data)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      if (this.isCollapse) {
        this.widthpercent = '90%'
      } else {
        this.widthpercent = '98%'
      }
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      if (activePath === '/welcome') {
        this.isDisplay = true
      } else {
        this.isDisplay = false
      }
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
  padding: 0;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.earth {
  height: calc(100% - 60px);
  width: calc(100% - 200px);
  position: fixed;
  background: black;
  padding: 0;
  margin: 0;
}
.routerView {
  padding: 20px;
  height: 100%;
  width: 82%;
  position: fixed;
  overflow-y: auto;
}
.earthContainer {
  height: 100%;
  width: 100%;
}
.displayNone {
  display: none;
}
</style>
