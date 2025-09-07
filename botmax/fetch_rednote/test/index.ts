
import { testAction, createActionContext } from '@lark-opdev/block-basekit-server-api';

async function test() {
    const actionContext = await createActionContext({
      tenantAccessToken: '',
    });
    
    testAction({
        profile: 'https://www.xiaohongshu.com/user/profile/6307a0ec000000000f005c02',
        cozeToken: 'cztei_q4VzYXLGHgk4p36JhUOaXd3GqP4daf7Fuq7WOtzV34ycdpSQlDd7Mfe8p02fUgBfZ',
        workflowID: '7532334873622626345',
    },
    actionContext);
}

test();
      