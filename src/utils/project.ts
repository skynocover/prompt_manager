import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  Firestore,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { createId } from '@paralleldrive/cuid2';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { firestore } from './firebase';

export interface IProjectInfo {
  id: string;
  projectName: string;
  projectDescription: string;
}

export const getAllProjects = async (teamId: string): Promise<IProjectInfo[]> => {
  const querySnapshot = await getDocs(query(collection(firestore, 'teams', teamId, 'projects')));
  return querySnapshot.docs.map((doc) => {
    const { projectName, projectDescription } = doc.data();
    return { id: doc.id, projectName, projectDescription };
  });
};

export const createProject = async (
  userId: string,
  teamId: string,
  projectName: string,
  projectDescription = '',
): Promise<string> => {
  const projectData: IProject = {
    projectName,
    projectDescription,
  };
  const projectId = createId();

  await setDoc(doc(firestore, 'teams', teamId, 'projects', projectId), projectData);
  return projectId;
};

export const deleteProject = async (teamId: string, projectId: string) => {
  await deleteDoc(doc(firestore, 'teams', teamId, 'projects', projectId));
};

export interface IProject {
  projectName: string;
  projectDescription: string;
}

interface IOpenAIChat {
  apiKey: string;
  model: string;
  system?: string;
  messages: ChatCompletionRequestMessage[];
}

export class OpenAIChat {
  private apiKey: string;
  private model: string;
  private system?: string;
  private messages: ChatCompletionRequestMessage[];
  private openai?: OpenAIApi;

  constructor({ apiKey, model, system, messages }: IOpenAIChat) {
    this.apiKey = apiKey;
    this.model = model;
    this.system = system;
    this.messages = messages;

    if (apiKey !== '') {
      const configuration = new Configuration({ apiKey });
      this.openai = new OpenAIApi(configuration);
    }
  }

  async SendMessage(content: string) {
    if (!this.openai) return;

    this.messages.push({ role: 'user', content });

    const messages = this.system
      ? [
          {
            role: 'system',
            content: this.system,
          } as ChatCompletionRequestMessage,
          ...this.messages,
        ]
      : this.messages;

    const { data } = await this.openai.createChatCompletion({
      model: this.model || 'gpt-3.5-turbo',
      messages,
    });
    if (data.choices[0].message) {
      this.messages.push(data.choices[0].message);
    }
  }

  getStorage(): IOpenAIChat {
    return {
      apiKey: this.apiKey,
      model: this.model,
      system: this.system,
      messages: this.messages,
    };
  }
  getMessages(): ChatCompletionRequestMessage[] {
    return this.messages;
  }
}

export class Project {
  private readonly db: Firestore;
  private teamId: string;
  public readonly Id: string;
  private openaiChat?: OpenAIChat;
  private project: IProject = {
    projectName: '',
    projectDescription: '',
  };

  constructor(teamId: string, projectId: string) {
    this.db = firestore;
    this.teamId = teamId;
    this.Id = projectId;
  }

  async init() {
    const docRef = doc(this.db, 'teams', this.teamId, 'projects', this.Id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { projectName, projectDescription, openAIChat } = docSnap.data();

      this.project = {
        projectName,
        projectDescription,
      };
      if (openAIChat && openAIChat.apiKey !== '') {
        this.openaiChat = new OpenAIChat({
          apiKey: openAIChat.apiKey,
          model: openAIChat.model,
          system: openAIChat.system,
          messages: openAIChat.messages,
        });
      }
    }
  }

  getProject(): IProject {
    return this.project;
  }
  getOpenAIChat(): OpenAIChat | undefined {
    return this.openaiChat;
  }

  //////////////////////////  存入Storage   //////////////////////////////////////

  async updateProject() {
    await updateDoc(doc(this.db, 'teams', this.teamId, 'projects', this.Id), {
      projectName: this.project.projectName,
      projectDescription: this.project.projectDescription,
      openAIChat: this.openaiChat ? this.openaiChat.getStorage() : {},
    });
  }

  async updateProjectInfo(projectName: string, projectDescription: string) {
    await updateDoc(doc(this.db, 'teams', this.teamId, 'projects', this.Id), {
      projectName,
      projectDescription,
    });
  }

  /////////////////////////  OpenAI  ///////////////////////////////////////
  async updateOpenAI({ apiKey, model = '', system }: IOpenAIChat) {
    this.openaiChat = new OpenAIChat({
      apiKey: apiKey,
      model: model,
      system: system,
      messages: this.openaiChat ? this.openaiChat.getMessages() : [],
    });

    await this.updateProject();
  }
}
