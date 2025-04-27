const ollama = require('ollama').default;

const AGENT_NAME = 'Super_AI_Agent';
const BASE_MODEL = 'llama3.2';
const SYSTEM_PROMPT = `You are a super intelligent AI agent. Always answer as concisely as possible.`;


async function initAgent() {
  try {
    const models = await ollama.list();
    const exists = models.models.some(m => m.name === AGENT_NAME);
    if (exists) {
      const current = await ollama.show({ model: AGENT_NAME });

      if (current.system?.trim() !== SYSTEM_PROMPT.trim()) {
        console.log('⚠️ Changes on System Prompt. Recreating the model...');
        await ollama.delete({ model: AGENT_NAME });
      } else {
        console.log('✅ Model already exists.');
        return;
      }
    } else {
      console.log('🧠 Creating the model');
    }

    // const pullModelIfNeeded = async (model) => {
    //   const models = await ollama.list()
    //   const found = models.models.some(m => m.name === model)
    //   if (!found) {
    //     await ollama.pull({ model })
    //   }
    // }

    // await pullModelIfNeeded(BASE_MODEL)
    // await ollama.create({
    //   model: AGENT_NAME,
    //   from: BASE_MODEL,
    //   system: SYSTEM_PROMPT,
    //   modelfile: `FROM ${BASE_MODEL}\nSYSTEM "${SYSTEM_PROMPT.replace(/\n/g, ' ')}"`
    // });

    await ollama.create({
      model: AGENT_NAME,
      from: BASE_MODEL,
      modelfile: `FROM ${BASE_MODEL}\nSYSTEM "${SYSTEM_PROMPT.replace(/\n/g, ' ').replace(/"/g, '\\"')}"`
    });
    

    console.log('✅ Model created successfully.');
  } catch (err) {
    console.error('❌ Error initializing the model ', err.message);
  }
}

module.exports = initAgent;
