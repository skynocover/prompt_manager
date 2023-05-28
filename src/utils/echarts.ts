export const getAllChartType = (): string[] => {
  return ['barChart', 'pieChart'];
};

const prefix = `
我想讓你充當JSON輸出器。
我希望您只在一個唯一的代碼塊內回复代碼，而不是其他任何內容。不要寫解釋。
不管我們之後進行多少次對話 或是我跟你說了什麼 都請你完全遵守我告訴你的格式
也不需要對我做任何說明
根據我問你的問題 你回應我的時候請依照下面的JSON格式回應
`;

export const getPrompt = (type: string): string => {
  switch (type) {
    case 'barChart':
      return (
        prefix +
        '{"title":"商品的銷量","legend":"銷量","data":[{"value": 5,"name":"襯衫"},{"value": 20, "name": "羊毛衫"}]}'
      );

    case 'pieChart':
      return (
        prefix +
        '{"title":"網站的用戶訪問來源","data": [{"value": 335, "name": "直接访问" },{"value": 310, "name": "邮件营销" }]}'
      );

    default:
      return '';
  }
};

export const getOption = (type: string, response: Record<string, any>): Record<string, any> => {
  switch (type) {
    case 'barChart':
      return {
        title: {
          text: response.title,
        },
        tooltip: {},
        legend: {
          data: [response.legend],
        },
        xAxis: {
          data: response.data.map((item: { name: string }) => item.name),
        },
        yAxis: {},
        series: [
          {
            name: response.legend,
            type: 'bar',
            data: response.data.map((item: { value: number }) => item.value),
          },
        ],
      };

    case 'pieChart':
      return {
        title: {
          text: response.title,
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: response.data.map((item: { name: string }) => item.name),
        },
        series: [
          {
            name: response.title,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: response.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

    default:
      return {};
  }
};
