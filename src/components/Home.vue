/*global a*/
/*eslint no-undef: ["error", { "typeof": false }] */
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
      widthpercent: '88%',
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
    /* eslint-disable no-undef */
    XbsjEarthUI.create('main').then(earthUI => {
      window.uia = earthUI

      earthUI.earth.sceneTree.root = {
        children: [
          {
            title: '数据中心',
            children: [
              {
                czmObject: {
                  xbsjType: 'Imagery',
                  xbsjGuid: 'd613f0ea-a4ed-4087-bb3a-62775e860c2c',
                  name: '谷歌影像',
                  xbsjImageryProvider: {
                    XbsjImageryProvider: {
                      url:
                        '//www.google.cn/maps/vt?lyrs=s,h&gl=CN&x={x}&y={y}&z={z}',
                      srcCoordType: 'GCJ02'
                    },
                    UrlTemplateImageryProvider: {},
                    WebMapTileServiceImageryProvider: {},
                    createTileMapServiceImageryProvider: {}
                  }
                }
              },
              {
                czmObject: {
                  xbsjType: 'Terrain',
                  xbsjGuid: 'c40da836-53de-4e07-8ff6-d086c1309af9',
                  name: '山东DEM',
                  xbsjTerrainProvider: {
                    type: 'XbsjCesiumTerrainProvider',
                    XbsjEllipsoidTerrainProvider: {},
                    XbsjCesiumTerrainProvider: {
                      url: 'http://localhost:8001',
                      requestVertexNormals: true,
                      requestWaterMask: true
                    }
                  }
                }
              },
              {
                title: '倾斜摄影',
                expand: false,
                children: [
                  {
                    czmObject: {
                      xbsjType: 'Tileset',
                      enabled: false,
                      xbsjGuid: '9d096c03-f09d-4a75-995a-e07256c2e09c',
                      name: '矿山修复倾斜摄影模型',
                      url: 'http://localhost:8003/tile/tileset.json',
                      show: false,
                      xbsjPosition: [
                        2.1324327341767795,
                        0.6525472041824204,
                        4.3682900814557725e-9
                      ],
                      xbsjClippingPlanes: {},
                      xbsjCustomShader: {}
                    }
                  }
                ]
              },
              {
                title: '矿体模型',
                expand: false,
                children: [
                  {
                    title: '金刚石',
                    children: [
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: 'f6485bbd-545e-4cb9-9330-1e3d0080874b',
                          name: '常马',
                          url: 'http://localhost:8003/changma/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.055605657634766,
                            0.6225356838320876,
                            -134.82544059596344
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '35bf440d-67b2-4d14-86d8-b38c23a98057',
                          name: '西峪6号矿',
                          url: 'http://localhost:8003/xiyu6/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.0580403413974704,
                            0.6252910319169509,
                            -9.406672114410465
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '168d1d9b-794c-46e0-9f96-9baf89c038a6',
                          name: '西峪28号矿',
                          url: 'http://localhost:8003/xiyu28/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.0581098824249833,
                            0.625332849945414,
                            37.48648770760293
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      }
                    ]
                  },
                  {
                    title: '金矿',
                    expand: false,
                    children: [
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: 'dca96f65-77ca-4326-b10c-ace82817f050',
                          name: '焦家',
                          url: 'http://localhost:8003/jiaojia/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.096499857868117,
                            0.6528031377182343,
                            -447.33208759885497
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: 'ddca06f6-c2e5-4a27-b43d-14015bd84efc',
                          name: '朱郭李',
                          url: 'http://localhost:8003/zhuguoli/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.0963073317168,
                            0.6525843555554112,
                            -551.736149258832
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      }
                    ]
                  },
                  {
                    title: '铁矿',
                    expand: false,
                    children: [
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '214bab1f-bf61-4b44-aa86-3b86eb4b32bd',
                          name: '莱芜牛泉',
                          url:
                            'http://localhost:8003/laiwuniuquan/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.051398003849689,
                            0.6317464702212914,
                            -177.95723308504523
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      }
                    ]
                  },
                  {
                    title: '有色金属',
                    expand: false,
                    children: [
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '6937a45b-d022-48fe-b29c-fc68aace0a28',
                          name: '大北河',
                          url: 'http://localhost:8003/dabeihe/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.11081132003007,
                            0.648300602821769,
                            -41.04423532853912
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: 'c600d28d-1e42-4c71-8bbe-6e6167db264f',
                          name: '文登佛顶山',
                          url: 'http://localhost:8003/fodingshan/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.1306754091030875,
                            0.6469574413782186,
                            -255.2947033888574
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '005e8daa-3182-4cb0-8700-90599fccfb5b',
                          name: '栖霞虎窝顶',
                          url: 'http://localhost:8003/huwoding/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.110804322045774,
                            0.6514036762468778,
                            -344.5942028809873
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '6e97a924-8163-4b39-b347-7281b7734b93',
                          name: '海阳刘家疃',
                          url: 'http://localhost:8003/liujiatong/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.111853450079054,
                            0.6434658435405474,
                            -39.91204920355732
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '020cfe2e-a57d-4bd6-821b-5e92425ae3c7',
                          name: '荣成南流水',
                          url: 'http://localhost:8003/nanliushui/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.13495806482311,
                            0.6490866099662319,
                            -104.40061724202619
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: 'a5b0608c-2092-4057-a615-33583de1d621',
                          name: '七宝山',
                          url: 'http://localhost:8003/qibaoshan/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.07854602654164,
                            0.6255450563496552,
                            -496.19369073699767
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '7268c6f9-0b02-4e6d-a043-525406497b22',
                          name: '栖霞尚家',
                          url: 'http://localhost:8003/shangjia/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.1133105693827874,
                            0.6487696397434966,
                            -240.1887996704514
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: 'b82b140c-b3fd-4500-9c4f-bb5ecc12893e',
                          name: '泗水龙湾套',
                          url: 'http://localhost:8003/longwantao/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.047327676513592,
                            0.6211371245613474,
                            31.07723915034101
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '3b35855c-128e-4bc3-a974-20f3d81a2980',
                          name: '福山王家庄',
                          url:
                            'http://localhost:8003/wangjiazhuang/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.115339961710861,
                            0.6541333692379923,
                            -578.535027919944
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      },
                      {
                        czmObject: {
                          xbsjType: 'Tileset',
                          enabled: false,
                          xbsjGuid: '2912ae1a-0500-4865-b04a-da89de356292',
                          name: '邢家山',
                          url: 'http://localhost:8003/xingjiashan/tileset.json',
                          show: false,
                          xbsjPosition: [
                            2.115748774318331,
                            0.6546345138647094,
                            -411.9607611173023
                          ],
                          xbsjClippingPlanes: {},
                          xbsjCustomShader: {}
                        }
                      }
                    ]
                  }
                ]
              },
              {
                czmObject: {
                  xbsjType: 'XbsjMyGeoJSON',
                  enabled: false,
                  xbsjGuid: '6b16cd8c-7575-4660-9494-0dcaf3bca487',
                  name: '钻孔数据',
                  url: 'http://localhost/sd.geojson',
                  show: false
                }
              },
              {
                title: '城市地质',
                expand: false,
                children: [
                  {
                    czmObject: {
                      xbsjType: 'Tileset',
                      enabled: false,
                      xbsjGuid: 'bb84da53-9081-4a11-bf44-9e768637fa66',
                      name: '威海地层',
                      url: 'http://localhost:8003/weihai/tileset.json',
                      show: false,
                      xbsjPosition: [
                        2.1313672786218905,
                        0.6523259685946222,
                        1743.5118160358797
                      ],
                      xbsjUseOriginTransform: false,
                      xbsjClippingPlanes: {},
                      xbsjCustomShader: {}
                    }
                  },
                  {
                    czmObject: {
                      xbsjType: 'Tileset',
                      enabled: false,
                      xbsjGuid: '8d5a3ce7-d573-4b6f-9a49-7fccc48360e1',
                      name: '威海剖面',
                      url: 'http://localhost:8003/weihaipomian/tileset.json',
                      show: false,
                      xbsjPosition: [
                        2.131374511313763,
                        0.6523266633474976,
                        1984.9808432398652
                      ],
                      xbsjUseOriginTransform: false,
                      xbsjClippingPlanes: {},
                      xbsjCustomShader: {}
                    }
                  }
                ]
              }
            ]
          }
        ]
      }

      // 设置启动操作
      uia.controls.mainBar._comp.$refs.navigate.usemybuttonNavigator = true
      earthUI.earth.czm.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH
      ]
      earthUI.earth.czm.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.PINCH,
        Cesium.CameraEventType.RIGHT_DRAG
      ]
      // 加载geojson数据
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
        this.widthpercent = '88%'
      } else {
        this.widthpercent = '97%'
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
  // width: calc(100% - 200px);
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
