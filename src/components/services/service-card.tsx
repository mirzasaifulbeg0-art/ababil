import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type ServiceCardData = {
  name: string;
  slug: string;
  shortDescription: string;
  serviceCharge: number;
  processingTime: string;
  categoryName?: string | null;
};

export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
      href={`/digital-services/${service.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand-green-200 hover:shadow-card-hover"
    >
      {service.categoryName && (
        <Badge variant="green" className="w-fit">
          {service.categoryName}
        </Badge>
      )}
      <h3 className="mt-3 font-heading text-lg font-semibold text-brand-navy-800 group-hover:text-brand-green-600">
        {service.name}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
        {service.shortDescription}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="flex items-center gap-1 text-slate-500">
          <Clock className="h-4 w-4" /> {service.processingTime}
        </span>
        <span className="font-semibold text-brand-green-600">
          {formatPrice(service.serviceCharge)}
        </span>
      </div>
      <span className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-navy-700">
        Apply now
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
