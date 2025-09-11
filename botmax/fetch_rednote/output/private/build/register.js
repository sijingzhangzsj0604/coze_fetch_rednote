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
            // 处理响应结果（官方最佳实践：直接消费 stream 的异步迭代器）
            let result = '';
            let msgValue = '';
            let debugUrl = '';
            const rawChunks = [];
            // 错误事件跟踪
            let hasErrorEvent = false;
            let errorMessageFromEvent = '';
            let errorCodeFromEvent;
            let errorDebugUrlFromEvent = '';
            for await (const chunk of res) {
                rawChunks.push(chunk);
                const eventName = chunk.event ? String(chunk.event).toLowerCase() : '';
                // 成功消息事件：累积内容
                if (eventName.includes('message')) {
                    result += chunk.data?.content || '';
                }
                // 错误事件：记录错误信息
                if (eventName === 'error') {
                    hasErrorEvent = true;
                    const data = chunk.data || {};
                    errorMessageFromEvent = data.error_message || data.msg || errorMessageFromEvent;
                    errorCodeFromEvent = data.error_code ?? errorCodeFromEvent;
                    errorDebugUrlFromEvent = data.debug_url || errorDebugUrlFromEvent;
                }
                // 额外字段抓取
                if (chunk.msg) {
                    msgValue = chunk.msg;
                }
                if (chunk.debug_url) {
                    debugUrl = chunk.debug_url;
                }
                if (chunk.data?.debug_url) {
                    debugUrl = chunk.data.debug_url;
                }
            }
            // 根据是否有 Error 事件决定返回
            if (hasErrorEvent) {
                const parts = [];
                if (errorMessageFromEvent)
                    parts.push(String(errorMessageFromEvent));
                if (errorCodeFromEvent !== undefined)
                    parts.push(`code=${errorCodeFromEvent}`);
                return {
                    success: false,
                    result: errorDebugUrlFromEvent || debugUrl || '',
                    message: parts.join(' | ') || '执行失败'
                };
            }
            return {
                success: true,
                result: debugUrl || result,
                message: result
            };
        }
        catch (error) {
            console.error('Coze API调用失败:', error);
            // 适配 Coze 实际错误返回结构
            const errAny = error;
            const cozeData = errAny?.response?.data || errAny?.data || {};
            const headers = errAny?.headers || errAny?.response?.headers || {};
            const debugUrl = cozeData?.debug_url || '';
            const code = cozeData?.code || cozeData?.error_code || errAny?.code;
            const logid = errAny?.logid || headers['x-tt-logid'] || headers['x-tt-trace-id'] || '';
            const baseMsg = cozeData?.msg || cozeData?.error_message || errAny?.message || '请求失败';
            const detail = cozeData?.detail;
            const parts = [String(baseMsg)];
            if (code)
                parts.push(`code=${code}`);
            if (logid)
                parts.push(`logid=${logid}`);
            if (detail)
                parts.push(`detail=${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
            return {
                success: false,
                result: debugUrl || '',
                message: parts.join(' | ')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVnaXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBcUY7QUFDckYsbUNBQW9DO0FBRXBDLGtDQUFPLENBQUMsU0FBUyxDQUFDO0lBQ2hCLFNBQVMsRUFBRTtRQUNUO1lBQ0UsTUFBTSxFQUFFLFNBQVM7WUFDakIsS0FBSyxFQUFFLFlBQVk7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxTQUFTLEVBQUUsb0NBQVMsQ0FBQyxLQUFLO1lBQzFCLGNBQWMsRUFBRTtnQkFDZCxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsV0FBVyxFQUFFLGVBQWU7YUFDN0I7U0FDRjtRQUNEO1lBQ0UsTUFBTSxFQUFFLFdBQVc7WUFDbkIsS0FBSyxFQUFFLFlBQVk7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxTQUFTLEVBQUUsb0NBQVMsQ0FBQyxLQUFLO1lBQzFCLGNBQWMsRUFBRTtnQkFDZCxXQUFXLEVBQUUsbUJBQW1CO2FBQ2pDO1NBQ0Y7UUFDRDtZQUNFLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLEtBQUssRUFBRSxPQUFPO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxTQUFTLEVBQUUsb0NBQVMsQ0FBQyxLQUFLO1lBQzFCLGNBQWMsRUFBRTtnQkFDZCxXQUFXLEVBQUUsY0FBYzthQUM1QjtTQUNGO0tBQ0Y7SUFDRCxTQUFTO0lBQ1QsT0FBTyxFQUFFLEtBQUssV0FBVSxJQUFJLEVBQUUsT0FBTztRQUNuQyxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFFaEQsaUJBQWlCO1lBQ2pCLE1BQU0sU0FBUyxHQUFHLElBQUksYUFBTyxDQUFDO2dCQUM1QixLQUFLLEVBQUUsU0FBUztnQkFDaEIsT0FBTyxFQUFFLHFCQUFxQjthQUMvQixDQUFDLENBQUM7WUFFSCxZQUFZO1lBQ1os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