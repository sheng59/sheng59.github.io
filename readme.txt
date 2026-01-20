建立新Table流程:
1. 加入新的tab名稱
const folderMap = {
  mirrorTable:   "mirror",
  magnetTable:   "magnet",
  coasterTable:  "coaster",
  woodTable:     "wood",
  paintingTable: "painting",
  monthTable:    "month",
  hotTable:      "hot",
 [你的table名稱]: "supabase上的storage資料夾名稱"
};
2. <li class="nav-item"><a class="nav-link" data-target="[你的Table名稱]">熱銷</a></li>
3. 在<div class="tab-content">加入

<table class="table table-bordered table-hover mb-0 align-middle text-center" id="[你的Table名稱]">
                      <thead>
                        <tr>
                          <th style="width: 80px">#</th>
                          <th>圖片</th>
                          <th>特徵</th>
                          <th>價格(NT$)</th>
                          <th>庫存</th>
                          <th style="width: 400px">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- 動態建立資料 -->
                      </tbody>
                    </table>
4. 在supabase上的storage建立資料夾存放圖片
5. 在supabase上的Table edit建立表格
6. 在table edit建立RLS policy
