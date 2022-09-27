import { PropertyType } from './models';

const residentialImages = [
  'https://felixwong.com/gallery/images/v/verdura-suites-archsense-apartment.jpg',
  'https://c.pxhere.com/images/8d/45/67df39beb6211d29ee7ab3f4c77e-1632949.jpg!d',
  'https://c.pxhere.com/photos/2b/c0/architecture_render_external_design_photoshop_3d_3dsmax_crown_render-599832.jpg!d',
  'https://images.pexels.com/photos/7214166/pexels-photo-7214166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://c.pxhere.com/photos/29/f1/interior_design_comfort_indoors_modern_interior_style_lamp_light-599719.jpg!d',
  'https://c.pxhere.com/photos/8c/05/home_inside_furniture_stairs_design_home_interior_decor_residential-807597.jpg!d',
];

export const propertiesPerType = (type: PropertyType) => {
  switch (type) {
    case 'residential':
      return { images: residentialImages, buy: 90000, rent: 400 };
    case 'commercial':
      return { buy: 400000, rent: 3000 };
    case 'land-plot':
      return { buy: 100000, rent: 5000 };
    default:
      return { buy: 90000, rent: 400 };
  }
};

export const random = (min, max) => {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1)) +
    Math.floor(min)
  );
};
