import { basekit, Component, ParamType } from '@lark-opdev/block-basekit-server-api';
import { CozeAPI } from '@coze/api';

basekit.addAction({
  formItems: [
    {
      itemId: 'profile',
      label: '小红书账号主页URL',
      required: true,
      component: Component.Input,
      componentProps: {
        mode: 'textarea',
        placeholder: '请输入小红书账号主页url',
      }
    },
    {
      itemId: 'cozeToken',
      label: 'Coze Token',
      required: true,
      component: Component.Input,
      componentProps: {
        placeholder: '请输入Coze API Token',
      }
    },
    {
      itemId: 'workflowID',
      label: '工作流ID',
      required: true,
      component: Component.Input,
      componentProps: {
        placeholder: '请输入Coze工作流ID',
      }
    }
  ],
  // 定义运行逻辑
  execute: async function(args, context) {
    try {
      const { profile, cozeToken, workflowID } = args;
      
      // 初始化Coze API客户端
      const apiClient = new CozeAPI({
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
      const rawChunks: any[] = [];

      // 错误事件跟踪
      let hasErrorEvent = false;
      let errorMessageFromEvent = '';
      let errorCodeFromEvent: string | number | undefined;
      let errorDebugUrlFromEvent = '';

      for await (const chunk of res as any) {
        rawChunks.push(chunk);
        const eventName = (chunk as any).event ? String((chunk as any).event).toLowerCase() : '';

        // 成功消息事件：累积内容
        if (eventName.includes('message')) {
          result += (chunk as any).data?.content || '';
        }

        // 错误事件：记录错误信息
        if (eventName === 'error') {
          hasErrorEvent = true;
          const data = (chunk as any).data || {};
          errorMessageFromEvent = data.error_message || data.msg || errorMessageFromEvent;
          errorCodeFromEvent = data.error_code ?? errorCodeFromEvent;
          errorDebugUrlFromEvent = data.debug_url || errorDebugUrlFromEvent;
        }

        // 额外字段抓取
        if ((chunk as any).msg) {
          msgValue = (chunk as any).msg;
        }
        if ((chunk as any).debug_url) {
          debugUrl = (chunk as any).debug_url;
        }
        if ((chunk as any).data?.debug_url) {
          debugUrl = (chunk as any).data.debug_url;
        }
      }

      // 根据是否有 Error 事件决定返回
      if (hasErrorEvent) {
        const parts: string[] = [];
        if (errorMessageFromEvent) parts.push(String(errorMessageFromEvent));
        if (errorCodeFromEvent !== undefined) parts.push(`code=${errorCodeFromEvent}`);
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
    } catch (error) {
      console.error('Coze API调用失败:', error);
      // 适配 Coze 实际错误返回结构
      const errAny: any = error as any;
      const cozeData = errAny?.response?.data || errAny?.data || {};
      const headers = errAny?.headers || errAny?.response?.headers || {};
      const debugUrl = cozeData?.debug_url || '';
      const code = cozeData?.code || cozeData?.error_code || errAny?.code;
      const logid = errAny?.logid || headers['x-tt-logid'] || headers['x-tt-trace-id'] || '';
      const baseMsg = cozeData?.msg || cozeData?.error_message || errAny?.message || '请求失败';
      const detail = cozeData?.detail;

      const parts: string[] = [String(baseMsg)];
      if (code) parts.push(`code=${code}`);
      if (logid) parts.push(`logid=${logid}`);
      if (detail) parts.push(`detail=${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);

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
    type: ParamType.Object,
    properties: {
      success: {
        type: ParamType.Boolean,
        label: '执行状态',
      },
      result: {
        type: ParamType.String,
        label: '获取结果',
      },
      message: {
        type: ParamType.String,
        label: '执行消息',
      },
    }
  }
});

export default basekit;
