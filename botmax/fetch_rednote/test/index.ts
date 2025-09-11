
import '../src/register';
import { testAction, createActionContext } from '@lark-opdev/block-basekit-server-api';

async function test() {
  const actionContext = await createActionContext({ tenantAccessToken: '' });

  const args = {
    profile: 'https://www.xiaohongshu.com/user/profile/5e0af1900000000001004355',
    cozeToken: 'sat_Rg96wFg7GOmddt6IaqBBVz8GiNfqAbFRR7WK4WT0sYrh61eC7c72U3MiNWdHBC1o',
    workflowID: '7532334873622626345',
  } as any;

  const res = await testAction(args, actionContext);
  console.log('test result:', JSON.stringify(res));
}

test().catch(err => {
  console.error('test error:', err);
});
      