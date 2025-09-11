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

      // 处理响应结果
      let result = '';
      let msgValue = '';
      let debugUrl = '';
      const rawChunks: any[] = [];
      for await (const chunk of res) {
        rawChunks.push(chunk);
        // 处理不同类型的响应事件
        if ((chunk as any).event && (chunk as any).event.includes('message')) {
          result += (chunk as any).data?.content || '';
        }
        // 提取msg字段值
        if ((chunk as any).msg) {
          msgValue = (chunk as any).msg;
        }
        // 提取debug_url字段值
        if ((chunk as any).debug_url) {
          debugUrl = (chunk as any).debug_url;
        }
      }

      return {
        success: true,
        result: debugUrl || result,
        message: JSON.stringify(rawChunks)
      };
    } catch (error) {
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
