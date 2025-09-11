"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const api_1 = require("@coze/api");
block_basekit_server_api_1.basekit.addAction({
    formItems: [
        {
            itemId: 'profile',
            label: '小红书账号主页URL',
            required: true,
            component: block_basekit_server_api_1.Component.Input,
            componentProps: {
                mode: 'textarea',
                placeholder: '请输入小红书账号主页url',
            }
        },
        {
            itemId: 'cozeToken',
            label: 'Coze Token',
            required: true,
            component: block_basekit_server_api_1.Component.Input,
            componentProps: {
                placeholder: '请输入Coze API Token',
            }
        },
        {
            itemId: 'workflowID',
            label: '工作流ID',
            required: true,
            component: block_basekit_server_api_1.Component.Input,
            componentProps: {
                placeholder: '请输入Coze工作流ID',
            }
        }
    ],
    // 定义运行逻辑
    execute: async function (args, context) {
        try {
            const { profile, cozeToken, workflowID } = args;
            // 初始化Coze API客户端
            const apiClient = new api_1.CozeAPI({
                token: cozeToken,
                baseURL: 'https://api.coze.cn'
            });
            // 调用Coze工作流
            const res = await apiClient.workflows.runs.stream({
                workflow_id: workflowID,
                parameters: {
                    profile: profile
                }
            });
            // 处理响应结果
            let result = '';
            let msgValue = '';
            let debugUrl = '';
            for await (const chunk of res) {
                // 处理不同类型的响应事件
                if (chunk.event && chunk.event.includes('message')) {
                    result += chunk.data?.content || '';
                }
                // 提取msg字段值
                if (chunk.msg) {
                    msgValue = chunk.msg;
                }
                // 提取debug_url字段值
                if (chunk.debug_url) {
                    debugUrl = chunk.debug_url;
                }
            }
            return {
                success: true,
                result: debugUrl || result,
                message: msgValue || '小红书数据获取成功'
            };
        }
        catch (error) {
            console.error('Coze API调用失败:', error);
            return {
                success: false,
                result: '',
                message: `获取失败: ${error.message}`
            };
        }
    },
    // 定义节点出参
    resultType: {
        // 声明返回为对象
        type: block_basekit_server_api_1.ParamType.Object,
        properties: {
            success: {
                type: block_basekit_server_api_1.ParamType.Boolean,
                label: '执行状态',
            },
            result: {
                type: block_basekit_server_api_1.ParamType.String,
                label: '获取结果',
            },
            message: {
                type: block_basekit_server_api_1.ParamType.String,
                label: '执行消息',
            },
        }
    }
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVnaXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBcUY7QUFDckYsbUNBQW9DO0FBRXBDLGtDQUFPLENBQUMsU0FBUyxDQUFDO0lBQ2hCLFNBQVMsRUFBRTtRQUNUO1lBQ0UsTUFBTSxFQUFFLFNBQVM7WUFDakIsS0FBSyxFQUFFLFlBQVk7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxTQUFTLEVBQUUsb0NBQVMsQ0FBQyxLQUFLO1lBQzFCLGNBQWMsRUFBRTtnQkFDZCxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsV0FBVyxFQUFFLGVBQWU7YUFDN0I7U0FDRjtRQUNEO1lBQ0UsTUFBTSxFQUFFLFdBQVc7WUFDbkIsS0FBSyxFQUFFLFlBQVk7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxTQUFTLEVBQUUsb0NBQVMsQ0FBQyxLQUFLO1lBQzFCLGNBQWMsRUFBRTtnQkFDZCxXQUFXLEVBQUUsbUJBQW1CO2FBQ2pDO1NBQ0Y7UUFDRDtZQUNFLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLEtBQUssRUFBRSxPQUFPO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxTQUFTLEVBQUUsb0NBQVMsQ0FBQyxLQUFLO1lBQzFCLGNBQWMsRUFBRTtnQkFDZCxXQUFXLEVBQUUsY0FBYzthQUM1QjtTQUNGO0tBQ0Y7SUFDRCxTQUFTO0lBQ1QsT0FBTyxFQUFFLEtBQUssV0FBVSxJQUFJLEVBQUUsT0FBTztRQUNuQyxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFFaEQsaUJBQWlCO1lBQ2pCLE1BQU0sU0FBUyxHQUFHLElBQUksYUFBTyxDQUFDO2dCQUM1QixLQUFLLEVBQUUsU0FBUztnQkFDaEIsT0FBTyxFQUFFLHFCQUFxQjthQUMvQixDQUFDLENBQUM7WUFFSCxZQUFZO1lBQ1osTUFBTSxHQUFHLEdBQUcsTUFBTSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ2hELFdBQVcsRUFBRSxVQUFVO2dCQUN2QixVQUFVLEVBQUU7b0JBQ1YsT0FBTyxFQUFFLE9BQU87aUJBQ2pCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsU0FBUztZQUNULElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNoQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQUksS0FBSyxFQUFFLE1BQU0sS0FBSyxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUM5QixjQUFjO2dCQUNkLElBQUssS0FBYSxDQUFDLEtBQUssSUFBSyxLQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO29CQUNyRSxNQUFNLElBQUssS0FBYSxDQUFDLElBQUksRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDO2dCQUMvQyxDQUFDO2dCQUNELFdBQVc7Z0JBQ1gsSUFBSyxLQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3ZCLFFBQVEsR0FBSSxLQUFhLENBQUMsR0FBRyxDQUFDO2dCQUNoQyxDQUFDO2dCQUNELGlCQUFpQjtnQkFDakIsSUFBSyxLQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQzdCLFFBQVEsR0FBSSxLQUFhLENBQUMsU0FBUyxDQUFDO2dCQUN0QyxDQUFDO1lBQ0gsQ0FBQztZQUVELE9BQU87Z0JBQ0wsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsTUFBTSxFQUFFLFFBQVEsSUFBSSxNQUFNO2dCQUMxQixPQUFPLEVBQUUsUUFBUSxJQUFJLFdBQVc7YUFDakMsQ0FBQztRQUNKLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsT0FBTztnQkFDTCxPQUFPLEVBQUUsS0FBSztnQkFDZCxNQUFNLEVBQUUsRUFBRTtnQkFDVixPQUFPLEVBQUUsU0FBUyxLQUFLLENBQUMsT0FBTyxFQUFFO2FBQ2xDLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUNELFNBQVM7SUFDVCxVQUFVLEVBQUU7UUFDVixVQUFVO1FBQ1YsSUFBSSxFQUFFLG9DQUFTLENBQUMsTUFBTTtRQUN0QixVQUFVLEVBQUU7WUFDVixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLG9DQUFTLENBQUMsT0FBTztnQkFDdkIsS0FBSyxFQUFFLE1BQU07YUFDZDtZQUNELE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsb0NBQVMsQ0FBQyxNQUFNO2dCQUN0QixLQUFLLEVBQUUsTUFBTTthQUNkO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxvQ0FBUyxDQUFDLE1BQU07Z0JBQ3RCLEtBQUssRUFBRSxNQUFNO2FBQ2Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsa0NBQU8sQ0FBQyJ9