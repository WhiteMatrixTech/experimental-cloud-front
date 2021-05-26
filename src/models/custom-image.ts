import * as API from '../services/custom-image';
import type { Reducer, Effect } from 'umi';
import { notification } from 'antd';

export enum ImageType {
  CA = 'ca',
  Peer = 'peer',
  Order = 'order'
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
  updatedAt: string;
  createdAt: string;
  _id: string;
}
export interface ImageTypeListState {
  imageType: string;
  value: string;
}
export type CustomImageModelState = {
  imageList: ImageDetail[];
  imageListTotal: number;
  ImageTypeList: ImageTypeListState[];
};

export type CustomImageModelType = {
  namespace: 'CustomImage';
  state: CustomImageModelState;
  effects: {
    getImageListForForm: Effect;
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
    imageListTotal: 0, //镜像列表总数
    ImageTypeList: [
      { imageType: 'ca', value: 'ca' },
      { imageType: 'peer', value: 'peer' },
      { imageType: 'order', value: 'order' }
    ] //镜像的类型
  },

  effects: {
    *getImageListForForm({ payload }, { call, put }) {
      const res = yield call(API.getImageList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const imageList = result.items.map((image: ImageDetail) => {
          return { ...image };
        });
        yield put({
          type: 'common',
          payload: {
            imageList
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
      const res = yield call(API.addCustomImage, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        //添加成功
        notification.success({ message: result.message, top: 64, duration: 3 });
      } else {
        notification.error({ message: '镜像添加失败', top: 64, duration: 3 });
      }
    },
    *deleteCustomImage({ payload }, { call, put }) {
      const res = yield call(API.deleteCustomImage, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message, top: 64, duration: 3 });
      } else {
        notification.error({ message: result.message, top: 64, duration: 3 });
      }
    }
  },
  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default CustomImageModel;
