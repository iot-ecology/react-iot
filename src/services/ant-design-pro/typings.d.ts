// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type UserListItem = {
    ID?: number;
    username?: string;
    password?: string;
    email?: string;
  };
  type SimListItem = {
    ID?: number;
    access_number?: string;
    iccid?: string;
    imsi?: string;
    operator?: string;
    expiration?: string;
  };
  type CassandraTransmitListItem = {
    ID?: number;
    name?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
  };
  type CassandraTransmitBindListItem = {
    ID?: number;
    protocol?: string;
    device_uid?: string;
    identification_code?: string;
    cassandra_transmit_id?: string;
    database?: string;
    table?: string;
    script?: string;
    enable?: string;
  };
  type ClickhouseTransmitBindListItem = {
    ID?: number;
    protocol?: string;
    device_uid?: string;
    identification_code?: string;
    clickhouse_transmit_id?: string;
    database?: string;
    table?: string;
    script?: string;
    enable?: string;
  };
  type InfluxdbTransmitBindListItem = {
    ID?: number;
    protocol?: string;
    device_uid?: string;
    identification_code?: string;
    influxdb_transmit_id?: string;
    bucket?: string;
    org?: string;
    tameasurementborgle?: string;
    script?: string;
    enable?: string;
  };
  type MongoTransmitBindListItem = {
    ID?: number;
    protocol?: string;
    device_uid?: string;
    identification_code?: string;
    mongo_transmit_id_transmit_id?: string;
    database?: string;
    collection?: string;
    script?: string;
    enable?: string;
  };
  type MySQLTransmitBindListItem = {
    ID?: number;
    protocol?: string;
    device_uid?: string;
    identification_code?: string;
    mysql_transmit_id?: string;
    table?: string;
    script?: string;
    enable?: string;
  };
  type ClickhouseTransmitListItem = {
    ID?: number;
    name?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
  };
  type MongoTransmitListItem = {
    ID?: number;
    name?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
  };
  type InfluxdbTransmitListItem = {
    ID?: number;
    name?: string;
    host?: string;
    port?: number;
    token?: string;
  };
  type MySQLTransmitListItem = {
    ID?: number;
    name?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
  };
  type HttpHandlerListItem = {
    ID?: number;
    device_info_id?: string;
    name?: string;
    username?: string;
    password?: string;
    script?: string;
  };
  type WsHandlerListItem = {
    ID?: number;
    device_info_id?: string;
    name?: string;
    username?: string;
    password?: string;
    script?: string;
  };
  type TcpHandlerListItem = {
    ID?: number;
    device_info_id?: string;
    name?: string;
    username?: string;
    password?: string;
    script?: string;
  };
  type CoapHandlerListItem = {
    ID?: number;
    device_info_id?: string;
    name?: string;
    username?: string;
    password?: string;
    script?: string;
  };
  type ScriptWaringListItem = {
    ID?: number;
    name?: string;
    script?: string;
  };
  type CalcParamListItem = {
    ID?: number;
    protocol?: string;
    identification_code?: string;
    device_uid?: string;
    name?: string;
    signal_name?: string;
    signal_id?: string;
    reduce?: string;
    calc_rule_id?: string;
  };
  type CalcRuleListItem = {
    ID?: number;
    name?: string;
    cron?: string;
    script?: string;
    offset?: string;
    start?: string;
    mock_value?: string;
  };
  type ScriptWaringParamListItem = {
    ID?: number;
    protocol?: string;
    identification_code?: string;
    device_uid?: number;
    name?: string;
    signal_name?: string;
    signal_id?: number;
    signal_delay_waring_id?: number;
  };
  type SignalWaringItem = {
    ID?: number;
    signal_id?: number;
    min?: number;
    max?: number;
    in_or_out?: number;
    protocol?: string;
    identification_code?: string;
    device_uid?: number;
  };
  type FeiShuListItem = {
    ID?: number;
    name?: string;
    access_token?: string;
    secret?: string;
    content?: string;
  };
  type DingDingListItem = {
    ID?: number;
    name?: string;
    access_token?: string;
    secret?: string;
    content?: string;
  };
  type SignalListItem = {
    ID?: number;
    protocol?: string;
    identification_code?: string;
    device_uid?: string;
    name?: string;
    alias?: string;
    type?: string;
    unit?: string;
    cache_size?: string;
  };
  type MqttListItem = {
    ID?: number;
    host?: string;
    port?: number;
    client_id?: string;
    username?: string;
    password?: string;
    subtopic?: string;
    start?: boolean;
    last_push_time?: string;
    script?: string;
  };
  type DeviceInfoListItem = {
    ID?: number;
    name?: string;
  };
  type RecordInfo = {
    product_id: ?number;
    quantity?: number;
  };

  type ShipmentRecordListItem = {
    ID?: number;
    shipment_date?: string;
    technician?: string;
    customer_name?: string;
    customer_phone?: string;
    customer_address?: string;
    tracking_number?: string;
    status?: string;
    description?: string;

    product_plans?: ProductPlanCreateParam[] | [];
  };

  type ProductPlanCreateParam = {
    product_id?: number;
    quantity?: number;
    shipment_record_id?: number;
    device_info_id?: number;
  };
  type DeviceGroupItem = {
    ID?: number;
    device_id?: number[];
    name?: string;
  };
  type DeviceGroupBindParam = {
    group_id?: number;
    device_id?: number[];
  };
  type ProductItem = {
    ID?: number;
    name?: string;
    description?: string;
    sku?: string;
    price?: number;
    cost?: number;
    quantity?: number;
    minimum_stock?: number;
    warranty_period?: number;
    status?: string;
    tags?: string;
    image_url?: string | FileItemUpload[];
  };
  type FileItemUpload = {
    response: FileUpdateResponse;
  };
  type FileUpdateResponse = {
    file_path: string;
    message: string;
  };
  type DeptListItem = {
    ID?: number;
    name?: string;
    parent_id?: number;
    parent_name?: string;
  };
  type DeviceInfoItem = {
    ID?: number;
    product_id?: number;
    sn?: string;
    manufacturing_date?: string;
    procurement_date?: string;
    source?: number;
    warranty_expiry?: string;
    push_interval?: string;
    error_rate?: number;
    protocol?: string;
  };
  type RoleListItem = {
    ID?: number;
    name?: string;
    description?: string;
  };
  type MessageListItem = {
    ID?: number;
    content?: string;
    en_content?: string;
    message_type_id?: number;
  };

  type RuleList = {
    data?: RuleListItem[] /** 列表的内容总数 */;
    total?: number;
    success?: boolean;
  };

  type PageList<T> = {
    data?: T[];
    total?: number;
    page?: number;
    size?: number;
  };
  type UserList = {
    data?: PageList<UserListItem> /** 列表的内容总数 */;
    message?: string;
    code?: number;
  };
  type CommonPage<T> = {
    data?: PageList<T> /** 列表的内容总数 */;
    message?: string;
    code?: number;
  };

  type CommonResp<T> = {
    data?: T;
    message?: string;
    code?: number;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    user_name?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string /** 业务上的错误信息 */;
    errorMessage?: string /** 业务上的请求是否成功 */;
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[] /** 列表的内容总数 */;
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type UserBindRoleParams = {
    user_id: number;
    role_ids: number[];
  };

  type UserBindDeptParams = {
    user_id: number;
    dept_ids: number[];
  };

  type UserBindRoleResult = {
    role_ids: number[];
    roles: {
      ID: number;
      name: string;
    }[];
  };

  type UserBindDeptResult = {
    dept_ids: number[];
    depts: {
      ID: number;
      name: string;
    }[];
  };

  type UserRoleBinding = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    user_id: number;
    role_id: number;
  };

  type UserDeptBinding = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    user_id: number;
    dept_id: number;
  };

  export interface DeviceInfoBindParam {
    device_info_id?: number | string;
    protocol?: string;
    identification_code?: string;
    handler_id?: number | string;
  }
}
