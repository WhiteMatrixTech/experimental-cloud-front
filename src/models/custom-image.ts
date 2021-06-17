import * as API from '../services/custom-image';
import type { Reducer, Effect } from 'umi';

export enum ImageType {
  CA = 'ca',
  Peer = 'peer',
  Order = 'order',
  CLI = 'cli'
}

export type ImageCredential = {
  username: string;
  password: string;
  registryServer: string;
};

export interface ImageDetail {
  imageUrl: string;
  imageType: ImageType;
  credential?: ImageCredential;
  updatedAt?: string;
  createdAt?: string;
  _id?: string;
}

export type CustomImageModelState = {
  imageList: ImageDetail[];
  imageListTotal: number;
};

export type CustomImageModelType = {
  namespace: 'CustomImage';
  state: CustomImageModelState;
  effects: {
    getImageListForForm: Effect;
    getImageList: Effect;
    getImageListTotal: Effect;
    addCustomImage: Effect;
    deleteCustomImage: Effect;
  };
  reducers: {
    common: Reducer<CustomImageModelState>;
  };
};

const CustomImageModel: CustomImageModelType = {
  namespace: 'CustomImage',

  state: {
    imageList: [], //镜像列表
    imageListTotal: 0 //镜像列表总数
  },

  effects: {
    *getImageListForForm({ payload }, { call, put }) {
      const res = yield call(API.getImageList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const imageList = result.items.map((image: ImageDetail) => {
          return {
            imageId: image._id,
            imageUrl: image.imageUrl,
            imageType: image.imageType,
            credential: image.credential
          };
        });
        yield put({
          type: 'common',
          payload: {
            imageList
          }
        });
      }
    },

    *getImageList({ payload }, { call, put }) {
      const res = yield call(API.getImageList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            imageList: result.items
          }
        });
      }
    },

    *getImageListTotal({ payload }, { call, put }) {
      const res = yield call(API.getImageListTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({ type: 'common', payload: { imageListTotal: result.count } });
      }
    },

    *addCustomImage({ payload }, { call, put }) {
      return yield call(API.addCustomImage, payload);
    },

    *deleteCustomImage({ payload }, { call, put }) {
      return yield call(API.deleteCustomImage, payload);
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default CustomImageModel;
