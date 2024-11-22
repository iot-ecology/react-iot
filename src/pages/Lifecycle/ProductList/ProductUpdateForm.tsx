import { FormattedMessage } from '@@/exports';
import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { Form, GetProp, message, Modal, Image, UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { useEffect, useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.ProductItem) => void;
  onSubmit: (values: API.ProductItem) => Promise<void>;
  updateModalOpen: boolean;

  values: API.ProductItem;
};

const ProductUpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...props.values,
      image_url: undefined, // 清除表单中的 image_url，因为我们使用 fileList 来管理
    });
    
    // 设置初始图片
    if (props.values.image_url) {
      setFileList([
        {
          uid: '-1',
          name: '当前图片',
          status: 'done',
          url: `/api/file/download?path=${props.values.image_url}`,
          response: { file_path: props.values.image_url },
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [props.values]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 如果有上传的文件，使用最新的文件路径
      if (fileList.length > 0 && fileList[0].response?.file_path) {
        values.image_url = fileList[0].response.file_path;
      }
      await props.onSubmit(values);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Modal
      key="userupdateform"
      destroyOnClose
      forceRender={true}
      open={props.updateModalOpen}
      onCancel={() => props.onCancel()}
      onOk={handleSubmit}
    >
      <Form 
        key={'userupdateform'} 
        form={form} 
        style={{ padding: '32px 40px 48px' }}
      >
        <ProForm.Group>
          <ProFormText
            disabled={true}
            key={'ID'}
            label={<FormattedMessage id="pages.id" />}
            name="ID"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
          <ProFormText
            key={'name'}
            label={<FormattedMessage id="pages.product.name" />}
            name="name"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
          <ProFormText
            key={'description'}
            label={<FormattedMessage id="pages.product.description" />}
            name="description"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
          <ProFormText
            key={'sku'}
            label={<FormattedMessage id="pages.product.sku" />}
            name="sku"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            key={'price'}
            label={<FormattedMessage id="pages.product.price" />}
            name="price"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
          <ProFormDigit
            key={'cost'}
            label={<FormattedMessage id="pages.product.cost" />}
            name="cost"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
          <ProFormDigit
            key={'quantity'}
            label={<FormattedMessage id="pages.product.quantity" />}
            name="quantity"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
          <ProFormDigit
            key={'minimum_stock'}
            label={<FormattedMessage id="pages.product.minimum_stock" />}
            name="minimum_stock"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
          <ProFormDigit
            key={'warranty_period'}
            label={<FormattedMessage id="pages.product.warranty_period" />}
            name="warranty_period"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="pages.rules.input" />,
              },
            ]}
          />
        </ProForm.Group>
        <ProFormText
          key={'status'}
          label={<FormattedMessage id="pages.product.status" />}
          name="status"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormText
          key={'tags'}
          label={<FormattedMessage id="pages.product.tags" />}
          placeholder={'请输入,如果存在多个请用逗号分割'}
          name="tags"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.input" />,
            },
          ]}
        />
        <ProFormUploadDragger
          name="image_url"
          label={<FormattedMessage id="pages.product.image_url" />}
          fieldProps={{
            accept: '.jpg,.png',
            name: 'file',
            action: '/api/file/update',
            multiple: false,
            listType: "picture",
            maxCount: 1,
            fileList: fileList,
            onPreview: async (file) => {
              const src = file.response?.file_path 
                ? `/api/file/download?path=${file.response.file_path}`
                : file.url;
              
              if (!src) {
                message.error('无法获取预览图片地址');
                return;
              }
              setPreviewImage(src);
              setPreviewTitle(file.name || '预览图片');
              setPreviewOpen(true);
            },
            onChange(info) {
              const { fileList: newFileList, file } = info;
              const { status, response } = file;
              
              // 更新文件列表
              setFileList(newFileList);

              if (status === 'done') {
                if (response?.file_path) {
                  // 更新文件的 URL
                  const updatedFile = {
                    ...file,
                    url: `/api/file/download?path=${response.file_path}`,
                  };
                  setFileList([updatedFile]);
                  message.success(`${file.name} 上传成功`);
                }
              } else if (status === 'error') {
                message.error(`${file.name} 上传失败`);
              }
            },
          }}
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.rules.select" />,
            },
          ]}
        />
      </Form>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image
          alt={previewTitle}
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </Modal>
  );
};

export default ProductUpdateForm;
