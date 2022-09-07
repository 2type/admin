package main

import (
	"bytes"
	"github.com/CloudyKit/jet/v6"
	xcaptcha "github.com/goclub/captcha"
	xerr "github.com/goclub/error"
	xhttp "github.com/goclub/http"
	xjson "github.com/goclub/json"
	"net/http"
	"reflect"
	"time"
)

var view *jet.Set

func init (){
	loader := jet.NewOSFileSystemLoader("./view")
	opts := []jet.Option{}
	opts = append(opts, jet.InDevelopmentMode())
	opts = append(opts, jet.WithDelims("[[", "]]"))
	view = jet.NewSet(
		loader,
		opts...
	)
	view.AddGlobalFunc("xjson", func(a jet.Arguments) reflect.Value {
		v := a.Get(0).Interface()
		buffer := bytes.NewBuffer(nil)
		err := xjson.NewEncoder(buffer).Encode(v) ; if err != nil {
			return reflect.ValueOf("encode json fail")
		}
		return reflect.ValueOf(buffer.Bytes())
	})
}

type JetRender struct {

}

func (j JetRender) Render(templatePath string, data interface{}, w http.ResponseWriter) (err error) {
	t, err := view.GetTemplate(templatePath) ; if err != nil {
	    return
	}
	return t.Execute(w, nil, data)
}

type any map[string]interface{}
type UploadRes struct {
	ID string `json:"id"`
	Filename string `json:"filename"`
	Src string `json:"src"`
	xerr.Resp
}
type ControlRes struct {
	Jump string `json:"jump"`
	JumpArgs []interface{} `json:"jumpArgs"`
	SuccessMessage string `json:"successMessage"`
	xerr.Resp
}
func main () {
	ms := xhttp.NewMockServer(xhttp.MockServerOption{
		DefaultReply: map[string]interface{}{
			"pass": xerr.Resp{},
			"fail": xerr.Resp{
				Error: xerr.RespError{
					Code:    1,
					Message: "xxx错误",
				},
			},
		},
		Render: JetRender{},
	})
	ms.URL(xhttp.Mock{
		Route: xhttp.Route{xhttp.GET, "/"},
		HandleFunc: func(c *xhttp.Context, data interface{}) error {
			http.Redirect(c.Writer, c.Request, "/admin/login", 302)
			return nil
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.POST, "/admin/upload/photo"},
		Reply:               xhttp.MockReply{
			"pass": UploadRes{
				Src: "https://picsum.photos/200/100",
				ID: "https://picsum.photos/200/100",
			},
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.POST, "/admin/upload/file"},
		Reply:               xhttp.MockReply{
			"pass": UploadRes{
				Filename: "abc.csv",
				ID: "some_id",
			},
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/admin/login"},
		Render: "login.html",
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/admin/logout"},
		HandleFunc: func(c *xhttp.Context, data interface{}) error {
			http.Redirect(c.Writer, c.Request, "/admin/login", 302)
			return nil
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.POST, "/admin/login"},
		Reply:               xhttp.MockReply{
			"pass": ControlRes{
				Jump: "/admin/home",
			},
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/admin/home"},
		Render: "home.html",
	})
	ms.URL(xhttp.Mock{
    		Route:               xhttp.Route{xhttp.GET, "/admin/area_stat"},
    		Render: "area_stat.html",
    	})
    ms.URL(xhttp.Mock{
        Route:               xhttp.Route{xhttp.GET, "/admin/area_stat/city"},
        Reply:               xhttp.MockReply{
            "pass": any{
                "cities": map[string]map[string]uint64{
                    "320100": map[string]uint64{
                        "uv": 100,
                        "scan": 80,
                        "newAccount": 20,
                    },
                    "320200": map[string]uint64{
                        "uv": 40,
                        "scan": 35,
                        "newAccount": 30,
                    },
                },
            },
        },
    })
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/admin/demo_list"},
		Render: "demo_list.html",
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/admin/demo_update"},
		Render: "demo_form.html",
		Reply:               xhttp.MockReply{
			"pass": any{
				"formKind": "update",
			},
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/admin/demo_create"},
		Render: "demo_form.html",
		Reply:               xhttp.MockReply{
			"pass": any{
				"formKind": "create",
			},
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.POST, "/admin/demo_create"},
		Reply:               xhttp.MockReply{
			"pass": ControlRes{
				SuccessMessage: "创建成功",
			},
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/captcha"},
		HandleFunc: func(c *xhttp.Context, data interface{}) (err error) {
			_, err = xcaptcha.New(c.Writer, xcaptcha.Option{}) ; if err != nil {
				return
			}
			return
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.POST, "/sms/send"},
	})
	ms.URL(xhttp.Mock{
        Route:               xhttp.Route{xhttp.GET, "/mobile"},
        Render: "mobile.html",
    })
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/mobile/home"},
		Reply: map[string]interface{}{
			"pass": map[string]interface{}{
				"banner": []map[string]interface{}{
					{
						"photo": "https://cdn1.lianlianlvyou.com/lianlian/common/2ca0c87d0e534ba3b5e27b13ac658d8d.png",
						"link":  "",
					},
					{
						"photo": "https://cdn2.lianlianlvyou.com/lianlian/common/2497a98be60e441db275e4f2d88f60df.png",
						"link":  "",
					},
				},
				"list": []map[string]interface{}{
					{
						"id": 1,
						"price": "99",
						"desc": "#火爆加推#【西南地区人气温泉水汇·第一江南·无需预约】仅99元/139元/169元享门市价168元/198元/326元【第一江南温泉水汇】成人/1大1小亲子票！足足四餐（刺身、牛排、海鲜自助...几百道菜品无限量供应）+电玩+桑拿+温泉+1800m²儿童乐园+3D电影院…60000m²全新场馆娱乐项目多到超乎你想象，家庭聚会团建都适合！",
						"title": "第一江南·无需预约·60000㎡超大水汇",
						"thumb": "https://cdn.lianlianlvyou.com/lianlian/design/845f5ab7aa69438ebc86b2f2f62a7ec8.gif",
						"originPrice": "168",
						"sales": 232,
					},
					{
						"id": 2,
						"price": "138",
						"desc": "【大龍火锅·无需预约｜春熙路店/锦里店/九眼桥店/玉林店等五店适用】春节不打烊138/228元享门市价344元/515元的火锅【大龍火锅4人餐/8人餐】，锅底八选一，巴掌嫩牛肉+ 精品千层肚+生扣鸭肠+ 鲜郡肝+香菜圆子+三线五花+广味香肠+手工虾滑+巴沙鱼片+鹌鹑蛋+鸭血+...锅底油碟全包～环境巴适，春节不打烊，年底聚会聚餐有面子！",
						"title": "大龍火锅·无需预约｜春节可用·五店适用",
						"thumb": "https://cdn2.lianlianlvyou.com/lianlian/design/649de79251f840fd809a4faad8f1a85c.gif",
						"originPrice": "344",
						"sales": 141,
					},
					{
						"id": 3,
						"price":"29.9",
						"desc":"颠覆大众苹果，舒服奶金色の奶油苹果等你尝鲜！松脆可口，清甜化渣，果香扑鼻！当奶油香气遇上苹果，解锁你不一样的味蕾体验！",
						"title":"劲爆特惠·入口即化爽口无渣·烟台奶油富士",
						"thumb":"https://cdn1.lianlianlvyou.com/lianlian/design/f119ff170b1b4f49b6ecede81e469c63.gif",
						"originPrice":"59",
						"sales": 1834,
					},
					{
						"id": 4,
						"price":"99",
						"desc":"【14店适用·全国连锁品牌·:·每天可约200+桌·可预约当天】春季福利来袭！现99元享门市价254元【守柴炉烤鸭】3-4人套餐！包含烤鸭1份（半只，配面皮、葱丝、黄瓜丝、甜面酱）+酸萝卜鸭架汤+香辣鸭架+虫草花拌鸭丝+午餐肉+时蔬+粉丝+豆皮+野菜煎饼/养生黑木耳（二选一）+纸巾！百年烤鸭，为您呈现地道京味！果木炭烤，皮脂酥脆，香气四溢，美味又养生~",
						"title":"守柴炉烤鸭·14店适用·全国连锁品牌",
						"thumb":"http://cdn.lianlianlvyou.com/lianlian/design/1d3c5a00e45b47f79c016b36fe30cb27.gif",
						"originPrice":"159",
						"sales": 134,
					},
					{
						"id": 5,
						"price":"88",
						"desc":"【音乐派量贩KTV•10店适用•全时段适用•周末可用】仅88元享门市价198元全时段任选4小时+6瓶雪花纯生/软饮2选1+爆米花大桶！298元享门市价498元欢唱3.5小时+大龙燚联名火锅套餐（12荤7素含锅底油碟：千层肚、鸭肠、肥牛、郡花、筷子牛肉～~~）KTV+火锅，打卡有我更欢乐~",
						"title":"音乐派量贩KTV•10店适用•周末可用",
						"thumb":"https://cdn.lianlianlvyou.com/lianlian/design/c68a460c00b14e4e978971be2d56eea3.gif",
						"originPrice":"199",
						"sales": 2313,
					},
				},
			},
		},
	})
	ms.URL(xhttp.Mock{
		Route:               xhttp.Route{xhttp.GET, "/mobile/user"},
		Reply: map[string]interface{}{
			"pass": map[string]interface{}{
				"name": "nimoc",
			},
		},
	})
	ms.PrefixHandle("/public", NoCacheFileServer{"./"})
	ms.Listen(4122)
}

type NoCacheFileServer struct {
	Dir string
}

func (n NoCacheFileServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Cache-control", "no-cache")
	w.Header().Add("Cache-control", "no-store")
	w.Header().Add("Expires", "0")
	w.Header().Add("Last-Modified", time.Now().String())
	w.Header().Add("Pragma", "no-cache")
	http.FileServer(http.Dir(n.Dir)).ServeHTTP(w, r)
}
