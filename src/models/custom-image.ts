import * as API from '../services/custom-image';
import type { Reducer, Effect } from 'umi';

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
}

export type CustomImageModelState = {
  imageList: ImageDetail[];
};

export type CustomImageModelType = {
  namespace: 'CustomImage';
  state: CustomImageModelState;
  effects: {
    getImageListForForm: Effect;
  };
  reducers: {
    common: Reducer<CustomImageModelState>;
  };
};

const CustomImageModel: CustomImageModelType = {
  namespace: 'CustomImage',

  state: {
    imageList: []
  },

  effects: {
    *getImageListForForm({ payload }, { call, put }) {
      const res = yield call(API.getImageList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        const imageList = result.items.map((image: ImageDetail) => {
          return {
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
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default CustomImageModel;
