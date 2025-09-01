@@ -1,14 +1,16 @@
1	+
// js/config.js
2	+
1	3	
// 全局常量配置
2	4	

3		-
const PROXY_URL = 'https://cors.zme.ink/';
5	+
const PROXY_URL = '/proxy/'; // 使用相对路径指向内部代理功能
4	6	
const HOPLAYER_URL = 'https://hoplayer.com/index.html';
5	7	
const SEARCH_HISTORY_KEY = 'videoSearchHistory';
6	8	
const MAX_HISTORY_ITEMS = 5;
7	9	

8	10	
// 网站信息配置
9	11	
const SITE_CONFIG = {
10	12	
    name: 'LibreTV',
11		-
    url: 'https://libretv.is-an.org',
13	+
    url: 'https://libretv.is-an.org', // 您可以改成您的实际部署地址
12	14	
    description: '免费在线视频搜索与观看平台',
13	15	
    logo: 'https://images.icon-icons.com/38/PNG/512/retrotv_5520.png',
14	16	
    version: '1.0.0'


@@ -55,6 +57,7 @@ const API_SITES = {
55	57	
        api: 'https://dbzy.com',
56	58	
        name: '豆瓣资源',
57	59	
    }
60	+
    // 您可以按需添加更多源
58	61	
};
59	62	

60	63	
// 添加聚合搜索的配置选项

@@ -69,15 +72,13 @@ const AGGREGATED_SEARCH_CONFIG = {
69	72	
// 抽象API请求配置
70	73	
const API_CONFIG = {
71	74	
    search: {
72		-
        // 修改搜索接口为返回更多详细数据（包括视频封面、简介和播放列表）
73	75	
        path: '/api.php/provide/vod/?ac=videolist&wd=',
74	76	
        headers: {
75	77	
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
76	78	
            'Accept': 'application/json'
77	79	
        }
78	80	
    },
79	81	
    detail: {
80		-
        // 修改详情接口也使用videolist接口，但是通过ID查询，减少请求次数
81	82	
        path: '/api.php/provide/vod/?ac=videolist&ids=',
82	83	
        headers: {
83	84	
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',

@@ -99,9 +100,9 @@ const PLAYER_CONFIG = {
99	100	
    width: '100%',
100	101	
    height: '600',
101	102	
    timeout: 15000,  // 播放器加载超时时间
102		-
    filterAds: true,  // 是否启用广告过滤
103	+
    filterAds: true,  // 是否启用广告过滤 (这个过滤由 player.html 实现)
103	104	
    autoPlayNext: true,  // 默认启用自动连播功能
104		-
    adFilteringEnabled: true, // 默认开启分片广告过滤
105	+
    adFilteringEnabled: true, // 默认开启分片广告过滤 (这个由 player.html 或下面的代理功能实现)
105	106	
    adFilteringStorage: 'adFilteringEnabled' // 存储广告过滤设置的键名
106	107	
};
107	108	


@@ -119,9 +120,10 @@ const SECURITY_CONFIG = {
119	120	
    enableXSSProtection: true,  // 是否启用XSS保护
120	121	
    sanitizeUrls: true,         // 是否清理URL
121	122	
    maxQueryLength: 100,        // 最大搜索长度
122		-
    allowedApiDomains: [        // 允许的API域名
123	+
    allowedApiDomains: [        // （此配置在此方案中作用不大，因为代理是内部的）
123	124	
        'heimuer.xyz',
124	125	
        'ffzy5.tv'
126	+
        // ... 其他您信任的API域名
125	127	
    ]
126	128	
};
127	129	


@@ -132,6 +134,28 @@ const CUSTOM_API_CONFIG = {
132	134	
    testTimeout: 5000,        // 测试超时时间(毫秒)
133	135	
    namePrefix: 'Custom-',    // 自定义源名称前缀
134	136	
    validateUrl: true,        // 验证URL格式
135		-
    cacheResults: true,       // 缓存测试结果
136		-
    cacheExpiry: 5184000000   // 缓存过期时间(2个月)
137	+
    cacheResults: true,       // 缓存测试结果 (针对 testCustomApiUrl 函数)
138	+
    cacheExpiry: 5184000000   // 缓存过期时间(2个月) (针对 testCustomApiUrl 函数)
137	139	
};
140	+
141	+
142	+
// --- 内部代理功能配置 (从 workers1.js 适配而来) ---
143	+
const FUNCTION_CONFIG = {
144	+
    CACHE_TTL: 86400,             // 缓存有效期（秒，这里是24小时）
145	+
    MAX_RECURSION: 5,             // 处理嵌套M3U8时的最大递归层数
146	+
    FILTER_DISCONTINUITY: true,   // 是否过滤M3U8中的 #EXT-X-DISCONTINUITY 标记
147	+
    USER_AGENTS: [                // 访问外部资源时使用的浏览器标识
148	+
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
149	+
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
150	+
    ],
151	+
    DEBUG: false                  // 是否在Cloudflare控制台输出调试日志
152	+
};
153	+
154	+
// 内部代理功能需要识别的媒体文件扩展名和类型
155	+
const MEDIA_FILE_EXTENSIONS = [
156	+
    '.mp4', '.webm', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.f4v', '.m4v', '.3gp', '.3g2', '.ts', '.mts', '.m2ts',
157	+
    '.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.wma', '.alac', '.aiff', '.opus',
158	+
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.avif', '.heic'
159	+
];
160	+
const MEDIA_CONTENT_TYPES = ['video/', 'audio/', 'image/'];
161	+
// --- 内部代理功能配置结束 ---
