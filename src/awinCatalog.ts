export type AwinProduct = {id:string;title:string;category:string;width:number;depth:number;height:number;merchantId:number;image?:string;url:string};

// Only products with three explicit dimensions in the supplied product title are promoted
// into the size-search catalog. This avoids inventing dimensions from incomplete feeds.
export const awinProducts: AwinProduct[] = [
  {"id":"awin-45568645435","title":"Mesa de comedor plegable madera de acacia 160x85x75cm","category":"Mesas","width":160,"depth":85,"height":75,"merchantId":24018,"image":"https://www.deubaxxl.de/media/a0/85/7b/850e2b45de1a14a8076ce2db88fb905d_a-de-100007g1-1-.jpg?ts=1775716862","url":"https://www.awin1.com/pclick.php?p=45568645435&a=3098668&m=24018"},
  {"id":"awin-43006988876","title":"Mesa de bar XXL Quattro 241x241x104cm","category":"Mesas","width":241,"depth":241,"height":104,"merchantId":24018,"image":"https://www.deubaxxl.de/media/95/fd/83/01_4_100051_on_fs-m.jpg?ts=1779786811","url":"https://www.awin1.com/pclick.php?p=43006988876&a=3098668&m=24018"},
  {"id":"awin-44019575221","title":"Baúl almacenaje Woody marrón 116x43x55cm 280L","category":"Mobiliario de exterior","width":116,"depth":43,"height":55,"merchantId":24018,"image":"https://www.deubaxxl.de/media/1c/8f/6d/01_108492_on_fs_high.jpg?ts=1775716778","url":"https://www.awin1.com/pclick.php?p=44019575221&a=3098668&m=24018"},
  {"id":"awin-29764327791","title":"Baúl almacenaje gris símil madera 116x43x55cm plegable","category":"Mobiliario de exterior","width":116,"depth":43,"height":55,"merchantId":24018,"image":"https://www.deubaxxl.de/media/b9/g0/3e/01_191390_on_fs_high.jpg?ts=1775716778","url":"https://www.awin1.com/pclick.php?p=29764327791&a=3098668&m=24018"}
];
