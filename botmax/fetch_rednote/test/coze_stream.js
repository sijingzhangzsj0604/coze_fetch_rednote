const { CozeAPI } = require('@coze/api');

(async () => {
  const token = 'sat_Rg96wFg7GOmddt6IaqBBVz8GiNfqAbFRR7WK4WT0sYrh61eC7c72U3MiNWdHBC1o';
  const workflow_id = '7532334873622626345';
  const profile = 'https://www.xiaohongshu.com/user/profile/5e0af1900000000001004355';

  const apiClient = new CozeAPI({ token, baseURL: 'https://api.coze.cn' });

  console.log('[coze:test] starting stream...');
  const res = await apiClient.workflows.runs.stream({
    workflow_id,
    parameters: { profile }
  });

  const chunks = [];
  let debugUrl = '';
  let text = '';

  try {
    for await (const chunk of res) {
      chunks.push(chunk);
      if (chunk && (chunk.debug_url || (chunk.data && chunk.data.debug_url))) {
        debugUrl = chunk.debug_url || (chunk.data && chunk.data.debug_url) || '';
      }
      if (chunk && chunk.event && String(chunk.event).toLowerCase().includes('message')) {
        text += (chunk.data && chunk.data.content) || '';
      }
      console.log('[coze:test] chunk:', JSON.stringify(chunk));
    }
  } catch (err) {
    console.error('[coze:test] stream error:', err);
  } finally {
    console.log('\n[coze:test] debug_url:', debugUrl);
    console.log('[coze:test] text:', text);
    console.log('[coze:test] raw:', JSON.stringify(chunks, null, 2));
  }
})();
