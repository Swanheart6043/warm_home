export interface Response<T> {
  code?: number;
  data?: T;
  success?: boolean;
}

export interface ResponseList<T> {
  code?: number;
  data?: T[];
  success?: boolean;
}

export interface Control {
  lamp: ControlRow[];
  speakers: ControlRow[];
  fan: ControlRow[];
  digitalTube: ControlRow[];
}

export interface ControlRow {
  key?: string;
  name?: string;
  checked?: boolean;
}

export interface PhotoWallItem {
  key?: string;
  name?: string;
  checked?: boolean;
}

export interface Environmenta {
  da?: number;
}
