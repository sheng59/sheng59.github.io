(function($) {

    "use strict";

    /**
      * 日期拆開
      */
    function splitDate(dateStr) {
        const [year, month, day] = dateStr.split("-"); // 直接用 "-" 拆開
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[parseInt(month, 10) - 1]; // 把月份轉成英文名稱

        return { day: parseInt(day, 10), monthName, year };
    }

    /**
      * 建立訊息框架
      */
    async function renderNews() {
        const newsList = document.querySelector(".news-list");
        const news = await fetchTableData3("news");

        newsList.innerHTML = ""; // 清空舊資料
        news.forEach(item => {
            var { day, monthName, year } = splitDate(item.date);
            
            const div = document.createElement("div");
            div.className = "row border-bottom py-3";
            div.innerHTML = `
                <div class="col-2 date-style">
                    <h2 class="date-number">${day}</h2>
                    <div class="date-text">${monthName}<br>${year}</div>
                </div>

                <div class="col-10">
                    <h5 class="fw-bold text-dark">${item.title}</h5>
                    <p class="text-muted mb-1" style="font-size: 14px;">${item.content}</p>
                </div> 
            `;
            newsList.appendChild(div);
        });
    }

    // document ready
    $(document).ready(function() {
        renderNews();
    }); // End of a document

})(jQuery);