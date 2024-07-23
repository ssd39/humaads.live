from dataclasses import dataclass
from typing import TypeAlias

@dataclass
class ProductDetail:
    poster: str
    info: str
    tag: str

ProductDetails: TypeAlias  = list[ProductDetail]

@dataclass
class Redirect:
   url: str 
   message: str

@dataclass
class AdData:
    title: str
    name: str
    video: str
    greetings: str
    banner_url: str
    redirect: Redirect
    product_details: ProductDetails
    

@dataclass
class AdDto:
    user_address: str
    on_chain_id: int
    data: AdData
