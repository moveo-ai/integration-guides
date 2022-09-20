import { PropertyType } from './models';

const apartmentImages = [
  'https://felixwong.com/gallery/images/v/verdura-suites-archsense-apartment.jpg',
  'https://c.pxhere.com/images/8d/45/67df39beb6211d29ee7ab3f4c77e-1632949.jpg!d',
  'https://c.pxhere.com/photos/2b/c0/architecture_render_external_design_photoshop_3d_3dsmax_crown_render-599832.jpg!d',
  'https://images.pexels.com/photos/7214166/pexels-photo-7214166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://c.pxhere.com/photos/29/f1/interior_design_comfort_indoors_modern_interior_style_lamp_light-599719.jpg!d',
  'https://c.pxhere.com/photos/8c/05/home_inside_furniture_stairs_design_home_interior_decor_residential-807597.jpg!d',
];

const detachedImages = [
  'https://c.pxhere.com/photos/3d/2a/house_building_home_residential_construction_architecture_real_estate-725713.jpg!d',
  'https://c.pxhere.com/photos/3d/2a/house_building_home_residential_construction_architecture_real_estate-725713.jpg!d',
  'https://c.pxhere.com/photos/3d/2a/house_building_home_residential_construction_architecture_real_estate-725713.jpg!d',
  'https://c.pxhere.com/photos/3d/2a/house_building_home_residential_construction_architecture_real_estate-725713.jpg!d',
  'https://c.pxhere.com/photos/3d/2a/house_building_home_residential_construction_architecture_real_estate-725713.jpg!d',
  'https://c.pxhere.com/photos/3d/2a/house_building_home_residential_construction_architecture_real_estate-725713.jpg!d',
  'https://c.pxhere.com/photos/3d/2a/house_building_home_residential_construction_architecture_real_estate-725713.jpg!d',
];

export const propertiesPerType = (type: PropertyType) => {
  switch (type) {
    case 'apartment':
      return { images: apartmentImages, buy: 90000, rent: 400 };
    case 'detached':
      return { images: detachedImages, buy: 150000, rent: 800 };
    case 'floor':
      return { images: apartmentImages, buy: 100000, rent: 1000 };
    case 'hotel':
      return { images: apartmentImages, buy: 400000, rent: 3000 };
    case 'industrial':
      return { images: apartmentImages, buy: 100000, rent: 1000 };
    case 'maisonette':
      return { images: apartmentImages, buy: 300000, rent: 1000 };
    case 'offices':
      return { images: apartmentImages, buy: 90000, rent: 400 };
    case 'villa':
      return { images: apartmentImages, buy: 400000, rent: 2500 };
    case 'block-of-flats':
      return { images: apartmentImages, buy: 400000, rent: 6000 };
    case 'retail-leisure':
      return { images: apartmentImages, buy: 100000, rent: 5000 };
    case 'land-plot':
      return { images: apartmentImages, buy: 100000, rent: 5000 };
  }
};

export const random = (min, max) => {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1)) +
    Math.floor(min)
  );
};
